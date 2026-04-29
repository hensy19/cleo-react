import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../../components/layout/Footer'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import signinImage from '../../assets/images/signin.svg'
import logo from '../../assets/images/logo.png'
import { Eye, EyeOff } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { GoogleLogin } from '@react-oauth/google'
import { api } from '../../utils/api'
import { clearUserData } from '../../utils/helpers'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await api.googleLogin(credentialResponse.credential);
      clearUserData();
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userInfo', JSON.stringify(response.user));
      const onboardingCompleted = response.user.has_onboarded;
      localStorage.setItem('onboardingCompleted', String(onboardingCompleted));
      navigate(onboardingCompleted ? '/dashboard' : '/onboarding');
    } catch (err) {
      setErrors({ server: "Google login failed: " + err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({ server: "Google login was unsuccessful. Please try again." });
  };

  const validateForm = () => {
    const newErrors = {}
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is not valid'
    if (!password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const response = await api.login({ email, password })
      
      // Clear any leftover data from previous user sessions
      clearUserData()
      
      // Success
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('userInfo', JSON.stringify(response.user))
      
      // Check if user has completed onboarding from server response
      const onboardingCompleted = response.user.has_onboarded;
      localStorage.setItem('onboardingCompleted', String(onboardingCompleted));
      
      navigate(onboardingCompleted ? '/dashboard' : '/onboarding')
    } catch (err) {
      setErrors({ server: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-visual">
          <img src={signinImage} alt="Sign In Illustration" className="signin-image" />
        </div>

        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <img src={logo} alt="CLEO Logo" className="login-logo" />
              <h1>{t('helloAgain')}</h1>
              <p>{t('welcomeBackMissed')}</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {errors.server && (
                <div className="error-alert">
                  {errors.server}
                </div>
              )}
              <Input
                label={t('emailAddress')}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                required
              />

              <Input
                label={t('passwordLabel')}
                type={showPassword ? 'text' : 'password'}
                placeholder={t('enterPassword') || 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
                suffix={
                  <button
                    type="button"
                    className="password-toggle-inline"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                }
              />

              <div className="login-options">
                <Link to="/forgot-password" title="reset password" style={{textDecoration: 'none', color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.9rem'}} className="forgot-password">{t('forgotPassword')}</Link>
              </div>

              <Button
                variant="primary"
                size="large"
                className="button-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? t('signingIn') : t('signIn')}
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
                  text="signin_with"
                  shape="pill"
                  width="100%"
                />
              </div>
            </form>

            <div className="login-footer">
              <p>{t('dontHaveAccount')} <Link to="/signup">{t('signup')}</Link></p>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  )
}
