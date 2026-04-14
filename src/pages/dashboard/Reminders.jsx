import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { useNotifications } from '../../context/NotificationContext'
import './Reminders.css'

export default function Reminders() {
  const navigate = useNavigate()
  const { showToast } = useNotifications()
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
    showToast('Reminder settings saved successfully!')
  }

  return (
    <DashboardLayout>
      <div className="reminders-page-container">
        <div className="reminders-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <ChevronLeft size={20} />
            <div className="title-group">
              <h1>Manage Reminders</h1>
              <p>Customize when and how you want Cleo to notify you</p>
            </div>
          </button>
        </div>

        <div className="reminders-content">
          <Card className="reminder-settings-card">
            <h3>Cycle Predictions</h3>
            
            <div className="reminder-item">
              <div className="reminder-info">
                <div className="reminder-title-row">
                  <span className="reminder-icon">🩸</span>
                  <h4>Period Approaching</h4>
                </div>
                <p>Get notified before your period is expected to start</p>
                {reminders.periodApproaching && (
                  <div className="reminder-sub-setting">
                    <label>Notify me</label>
                    <select 
                      value={daysBeforePeriod} 
                      onChange={(e) => setDaysBeforePeriod(Number(e.target.value))}
                      className="reminders-select"
                    >
                      <option value={1}>1 day before</option>
                      <option value={2}>2 days before</option>
                      <option value={3}>3 days before</option>
                      <option value={5}>5 days before</option>
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
                  <h4>Ovulation Window</h4>
                </div>
                <p>Get notified when your fertile window is starting</p>
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
                  <h4>Daily check-in</h4>
                </div>
                <p>Reminder to log your symptoms, mood, and notes</p>
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
                  <h4>Medication/Pill Reminder</h4>
                </div>
                <p>Daily reminder to take your medication</p>
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
            <h3>Notification Preferences</h3>
            <div className="reminder-time-setting">
              <label>Default Reminder Time</label>
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
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
