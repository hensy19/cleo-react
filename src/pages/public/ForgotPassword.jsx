import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import { useLanguage } from '../../context/LanguageContext'
import { api } from '../../utils/api'
import './ForgotPassword.css'

export default function ForgotPassword() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    try {
      setError('')
      await api.forgotPassword(email)
      setIsSubmitted(true)
    } catch (err) {
      setError(err.message || 'Failed to send reset link')
    }
  }

  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-container">
        {!isSubmitted ? (
          <div className="auth-card">
            <div className="auth-header">
              <h1>{t('forgotPasswordTitle')}</h1>
              <p>{t('forgotPasswordDesc')}</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('email')}</label>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    placeholder="       name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn">
                {t('sendResetLink')}
              </button>
            </form>

            <div className="auth-footer">
              <Link to="/login" className="back-to-login">
                <ArrowLeft size={16} /> {t('backToLogin')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="auth-card success-card">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={64} className="success-check" />
            </div>
            <h1>{t('checkYourEmail')}</h1>
            <p>{t('resetEmailSent')} <strong>{email}</strong>. {t('checkInboxSpam')}</p>

            <button className="auth-btn" onClick={() => setIsSubmitted(false)}>
              {t('didntReceiveEmail')}
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
