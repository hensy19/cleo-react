import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, X, Scale, FileText } from 'lucide-react'
import signupImage from '../../assets/images/signup.svg'
import logo from '../../assets/images/logo.png'
import Footer from '../../components/layout/Footer'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { useLanguage } from '../../context/LanguageContext'
import { GoogleLogin } from '@react-oauth/google'
import { api } from '../../utils/api'
import { useSettings } from '../../context/SettingsContext'
import './Signup.css'

export default function Signup() {
  const { settings, isLoading: settingsLoading } = useSettings()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [policyType, setPolicyType] = useState('privacy') // 'privacy' | 'terms'
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await api.googleLogin(credentialResponse.credential);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userInfo', JSON.stringify(response.user));
      const onboardingCompleted = response.user.has_onboarded;
      localStorage.setItem('onboardingCompleted', String(onboardingCompleted));
      navigate(onboardingCompleted ? '/dashboard' : '/onboarding');
    } catch (err) {
      setErrors({ server: "Google signup failed: " + err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({ server: "Google registration was unsuccessful. Please try again." });
  };

  const openPolicy = (e, type) => {
    e.preventDefault()
    setPolicyType(type)
    setShowPolicyModal(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is not valid'

    // Dynamic Password Validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      if (settings.pwdRequireLength && formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
      } else if (!settings.pwdRequireLength && formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }

      if (settings.pwdRequireUppercase && !/[A-Z]/.test(formData.password)) {
        newErrors.password = newErrors.password
          ? newErrors.password + ' and include an uppercase letter'
          : 'Password must include at least one uppercase letter'
      }
    }

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Extra safety: block if registration is disabled
    if (settings.allowRegistration === false) {
      setErrors({ server: 'Registrations are currently closed.' })
      return
    }

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({}) // Clear previous errors

    try {
      const response = await api.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })

      // Success
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('userInfo', JSON.stringify(response.user))
      localStorage.setItem('onboardingCompleted', 'false')

      navigate('/onboarding')
    } catch (err) {
      setErrors({ server: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
        <div className="signup-visual">
          <img src={signupImage} alt="Sign Up Illustration" className="signup-image" />
        </div>

        <div className="signup-container">
          <div className="signup-card">
            <div className="signup-header">
              <img src={logo} alt="CLEO Logo" className="signup-logo" />
              <h1>{t('createAccount')}</h1>
              <p>{t('joinUsTracking')}</p>
            </div>

            <form onSubmit={handleSubmit} className="signup-form">
              {errors.server && (
                <div className="error-alert">
                  {errors.server}
                </div>
              )}

              {settings.allowRegistration === false && (
                <div className="registration-closed-alert">
                  <ShieldCheck size={20} />
                  <span>{t('Registrations Closed')}</span>
                </div>
              )}

              <Input
                label={t('fullName')}
                type="text"
                placeholder={t('fullName') || "Your full name"}
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                disabled={settings.allowRegistration === false}
              />

              <Input
                label={t('emailAddress')}
                type="email"
                placeholder="you@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                disabled={settings.allowRegistration === false}
              />

              <Input
                label={t('passwordLabel')}
                type={showPassword ? 'text' : 'password'}
                placeholder={t('enterPassword') || "Enter your password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                disabled={settings.allowRegistration === false}
                suffix={
                  <button
                    type="button"
                    className="password-toggle-inline"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={settings.allowRegistration === false}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                }
              />

              <div className="password-hints">
                <p className={formData.password.length >= (settings.pwdRequireLength ? 8 : 6) ? 'met' : ''}>
                  {settings.pwdRequireLength ? 'Min. 8 characters' : 'Min. 6 characters'}
                </p>
                {settings.pwdRequireUppercase && (
                  <p className={/[A-Z]/.test(formData.password) ? 'met' : ''}>
                    Include one uppercase letter
                  </p>
                )}
              </div>

              <Input
                label={t('confirmPassword')}
                type={showConfirm ? 'text' : 'password'}
                placeholder={t('confirmPassword')}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                disabled={settings.allowRegistration === false}
                suffix={
                  <button
                    type="button"
                    className="password-toggle-inline"
                    onClick={() => setShowConfirm(!showConfirm)}
                    disabled={settings.allowRegistration === false}
                  >
                    {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                }
              />

              <div className="terms">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                  disabled={settings.allowRegistration === false}
                />
                <label htmlFor="acceptTerms">
                  {t('iAgreeTo')} <a href="#terms" onClick={(e) => openPolicy(e, 'terms')}>{t('termsOfService')}</a> {t('and')} <a href="#privacy" onClick={(e) => openPolicy(e, 'privacy')}>{t('privacyPolicy')}</a>
                </label>
              </div>

              <Button
                variant="primary"
                size="large"
                className="button-full"
                type="submit"
                disabled={isLoading || settings.allowRegistration === false || settingsLoading}
              >
                {settingsLoading ? '...' : (isLoading ? t('creatingAccount') : t('createAccount'))}
              </Button>

              <div className="login-separator">
                <span>{t('or') || 'OR'}</span>
              </div>

              <div className="google-login-wrapper">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="signup_with"
                  shape="pill"
                  width="100%"
                />
              </div>
            </form>

            <div className="signup-footer">
              <p>{t('alreadyHaveAccount')} <Link to="/login">{t('signIn')}</Link></p>
            </div>
          </div>
        </div>
      </div>

      {showPolicyModal && (
        <div className="policy-modal-overlay">
          <div className="policy-modal-card">
            <button className="close-modal-btn" onClick={() => setShowPolicyModal(false)}>
              <X size={20} />
            </button>

            <div className="modal-policy-header">
              {policyType === 'privacy' ? (
                <>
                  <ShieldCheck size={40} className="modal-icon blue" />
                  <h2>{t('privacyPolicy')}</h2>
                </>
              ) : (
                <>
                  <Scale size={40} className="modal-icon gold" />
                  <h2>{t('termsOfService')}</h2>
                </>
              )}
            </div>

            <div className="modal-policy-content">
              {policyType === 'privacy' ? (
                <div className="policy-text-block">
                  <p className="intro-lead">At Cleo, your privacy is our foundation. We recognize that health data is extremely sensitive, and we are committed to providing the highest level of protection.</p>

                  <h3><ShieldCheck size={18} /> Our Commitment</h3>
                  <p>All data is encrypted in transit and at rest using AES-256 standards. We never sell your personal or health data to advertisers.</p>

                  <h3>1. Information We Collect</h3>
                  <ul>
                    <li><strong>Profile Data:</strong> Name, Email, and Date of Birth.</li>
                    <li><strong>Cycle Data:</strong> Period dates, flow, and duration for predictions.</li>
                    <li><strong>Health Logs:</strong> Symptoms, moods, and health goals.</li>
                  </ul>

                  <h3>2. Your Data Rights</h3>
                  <div className="modal-warning-box">
                    <strong>Permanent Deletion Policy:</strong> Deleting your account will permanently erase all data from our primary servers and backups instantly.
                  </div>
                </div>
              ) : (
                <div className="policy-text-block">
                  <div className="modal-warning-box medical">
                    <strong>{t('medicalDisclaimer')}</strong> {t('medicalDisclaimerText')}
                  </div>

                  <h3>1. Agreement to Terms</h3>
                  <p>By using Cleo, you agree to be bound by these legal terms. If you do not agree, you must discontinue use immediately.</p>

                  <h3>2. User Representations</h3>
                  <p>You represent that your registration info is accurate and that you are at least 13 years of age (or legal age in your region).</p>

                  <h3>3. Intellectual Property</h3>
                  <p>All source code, databases, and website designs are proprietary property of Cleo and protected by copyright laws.</p>

                  <h3>4. Limitation of Liability</h3>
                  <p>In no event will we be liable for any direct or indirect damages arising from your use of the platform.</p>
                </div>
              )}
            </div>

            <div className="modal-policy-footer">
              <button className="confirm-policy-btn" onClick={() => {
                setFormData({ ...formData, acceptTerms: true });
                setShowPolicyModal(false);
              }}>
                {t('iUnderstandAgree')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
