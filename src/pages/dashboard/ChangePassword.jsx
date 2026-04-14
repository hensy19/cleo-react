import { useState } from 'react'
import { Monitor } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import './ChangePassword.css'

export default function ChangePassword() {
  const { t } = useLanguage()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: t('passwordsDoNotMatch') })
      return
    }
    
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setMessage({ type: 'success', text: t('passwordSavedSuccess') })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="change-password-page">
        <div className="hifi-password-card">
          <div className="form-column">
            <h2>{t('changePasswordTitle')}</h2>
            
            <form onSubmit={handleSubmit} className="hifi-form">
              <div className="hifi-group">
                <label>{t('currentPasswordLabel')}</label>
                <input 
                  type="password" 
                  placeholder={t('enterCurrentPassword')}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="hifi-group">
                <label>{t('newPasswordLabel')}</label>
                <input 
                  type="password" 
                  placeholder={t('enterNewPassword')}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="hifi-group">
                <label>{t('confirmPasswordLabel')}</label>
                <input 
                  type="password" 
                  placeholder={t('reEnterPassword')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {message.text && (
                <div className={`hifi-message ${message.type}`}>
                  {message.text}
                </div>
              )}

              <button type="submit" className="save-password-btn" disabled={isLoading}>
                {isLoading ? t('saving') : t('savePassword')}
              </button>
            </form>
          </div>

          <div className="visual-column">
            <div className="monitor-illustration">
              <div className="monitor-frame">
                <div className="monitor-screen">
                  <div className="screen-avatar"></div>
                  <div className="screen-lock-ui">
                    <div className="lock-dot"></div>
                    <div className="lock-bar">
                      <div className="lock-stars">********</div>
                    </div>
                  </div>
                </div>
                <div className="monitor-stand"></div>
                <div className="monitor-base"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
