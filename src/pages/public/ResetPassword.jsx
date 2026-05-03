import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import { api } from '../../utils/api'
import './ForgotPassword.css'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password || password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setError('')
      await api.resetPassword(token, password)
      setIsSubmitted(true)
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError(err.message || 'Failed to reset password')
    }
  }

  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-container">
        {!isSubmitted ? (
          <div className="auth-card">
            <div className="auth-header">
              <h1>Reset Password</h1>
              <p>Enter your new password below.</p>
            </div>

            {error && <div className="auth-error" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>New Password</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={20} />
                  <input
                    type="password"
                    placeholder="       ••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={20} />
                  <input
                    type="password"
                    placeholder="       ••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn">
                Reset Password
              </button>
            </form>

            <div className="auth-footer">
              <Link to="/login" className="back-to-login">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="auth-card success-card">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={64} className="success-check" />
            </div>
            <h1>Password Reset Successful!</h1>
            <p>Your password has been securely updated. You will be redirected to the login page momentarily.</p>

            <Link to="/login" className="auth-btn" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              Go to Login Now
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
