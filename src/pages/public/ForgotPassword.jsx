import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import './ForgotPassword.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      // Logic for sending reset email would go here
      setIsSubmitted(true)
    }
  }

  return (
    <div className="auth-page">
      <Navbar />
      
      <div className="auth-container">
        {!isSubmitted ? (
          <div className="auth-card">
            <div className="auth-header">
              <h1>Forgot Password?</h1>
              <p>Enter your email and we'll send you a link to reset your password.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={20} />
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn">
                Send Reset Link
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
            <h1>Check your Email</h1>
            <p>We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.</p>
            
            <button className="auth-btn" onClick={() => setIsSubmitted(false)}>
              Didn't receive it? Try again
            </button>
            
            <div className="auth-footer">
              <Link to="/login" className="back-to-login">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
