import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../../components/layout/Footer'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import signinImage from '../../assets/images/signin.svg'
import { Eye, EyeOff } from 'lucide-react'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

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
              <h1>Hello Again!</h1>
              <p>Welcome back you have been missed!</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
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
                <a href="#forgot-password" className="forgot-password">Forgot Password?</a>
              </div>

              <Button
                variant="primary"
                size="large"
                className="button-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="login-footer">
              <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  )
}
