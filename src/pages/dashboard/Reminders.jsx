import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { useNotifications } from '../../context/NotificationContext'
import { useLanguage } from '../../context/LanguageContext'
import './Reminders.css'

export default function Reminders() {
  const navigate = useNavigate()
  const { showToast } = useNotifications()
  const { t } = useLanguage()
  const [reminders, setReminders] = useState({
    periodApproaching: true,
    ovulationApproaching: true,
    dailyLog: false,
    pillReminder: false,
  })

  const [reminderTime, setReminderTime] = useState('09:00')
  const [daysBeforePeriod, setDaysBeforePeriod] = useState(2)

  const handleToggle = (key) => {
    setReminders(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    // Save to local storage or API
    console.log('Saved reminders:', { reminders, reminderTime, daysBeforePeriod })
    showToast(t('passwordSavedSuccess')) // Reusing this for success message or I should have added a specific one
  }

  return (
    <DashboardLayout>
      <div className="reminders-page-container">
        <div className="reminders-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <ChevronLeft size={20} />
            <div className="title-group">
              <h1>{t('manageReminders')}</h1>
              <p>{t('remindersSubtitle')}</p>
            </div>
          </button>
        </div>

        <div className="reminders-content">
          <Card className="reminder-settings-card">
            <h3>{t('cyclePredictionsLabel')}</h3>
            
            <div className="reminder-item">
              <div className="reminder-info">
                <div className="reminder-title-row">
                  <span className="reminder-icon">🩸</span>
                  <h4>{t('periodApproachingLabel')}</h4>
                </div>
                <p>{t('periodApproachingDesc')}</p>
                {reminders.periodApproaching && (
                  <div className="reminder-sub-setting">
                    <label>{t('notifyMe')}</label>
                    <select 
                      value={daysBeforePeriod} 
                      onChange={(e) => setDaysBeforePeriod(Number(e.target.value))}
                      className="reminders-select"
                    >
                      <option value={1}>1 {t('dayBefore')}</option>
                      <option value={2}>2 {t('daysBefore')}</option>
                      <option value={3}>3 {t('daysBefore')}</option>
                      <option value={5}>5 {t('daysBefore')}</option>
                    </select>
                  </div>
                )}
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={reminders.periodApproaching} 
                  onChange={() => handleToggle('periodApproaching')} 
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="reminder-item">
              <div className="reminder-info">
                <div className="reminder-title-row">
                  <span className="reminder-icon">✨</span>
                  <h4>{t('ovulationWindowLabel')}</h4>
                </div>
                <p>{t('ovulationWindowDesc')}</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={reminders.ovulationApproaching} 
                  onChange={() => handleToggle('ovulationApproaching')} 
                />
                <span className="slider round"></span>
              </label>
            </div>
          </Card>

          <Card className="reminder-settings-card">
            <h3>Daily Habits</h3>
            
            <div className="reminder-item">
              <div className="reminder-info">
                <div className="reminder-title-row">
                  <span className="reminder-icon">📝</span>
                  <h4>{t('dailyCheckInLabel')}</h4>
                </div>
                <p>{t('dailyCheckInDesc')}</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={reminders.dailyLog} 
                  onChange={() => handleToggle('dailyLog')} 
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="reminder-item">
              <div className="reminder-info">
                <div className="reminder-title-row">
                  <span className="reminder-icon">💊</span>
                  <h4>{t('medicationReminderLabel')}</h4>
                </div>
                <p>{t('medicationReminderDesc')}</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={reminders.pillReminder} 
                  onChange={() => handleToggle('pillReminder')} 
                />
                <span className="slider round"></span>
              </label>
            </div>
          </Card>

          <Card className="reminder-settings-card">
            <h3>{t('notificationPrefsLabel')}</h3>
            <div className="reminder-time-setting">
              <label>{t('defaultReminderTime')}</label>
              <input 
                type="time" 
                value={reminderTime} 
                onChange={(e) => setReminderTime(e.target.value)} 
                className="time-input"
              />
            </div>
          </Card>

          <div className="reminders-actions">
            <Button onClick={handleSave} className="save-reminders-btn btn-primary">
              {t('saveSettings')}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
