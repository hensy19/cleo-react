import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { Eye, EyeOff } from 'lucide-react'
import './AdminLogin.css'

export default function AdminLogin() {
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
    setTimeout(() => {
      localStorage.setItem('adminToken', 'admin_token_' + Date.now())
      localStorage.setItem('adminInfo', JSON.stringify({
        email,
        role: 'admin'
      }))
      navigate('/admin/dashboard')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h1>Admin Panel</h1>
            <p>Sign in to manage CLEO</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <Input
              label="Admin Email"
              type="email"
              placeholder="admin@cleo.app"
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

            <Button
              variant="primary"
              size="large"
              className="button-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Admin Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
