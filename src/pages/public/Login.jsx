import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../../components/layout/Footer'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import signinImage from '../../assets/images/signin.svg'
import logo from '../../assets/images/logo.png'
import { Eye, EyeOff } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useLanguage()

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
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('authToken', 'token_' + Date.now())
      localStorage.setItem('userInfo', JSON.stringify({
        email,
        name: email.split('@')[0]
      }))
      // Check if user has completed onboarding
      const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true'
      navigate(onboardingCompleted ? '/dashboard' : '/onboarding')
      setIsLoading(false)
    }, 1000)
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
