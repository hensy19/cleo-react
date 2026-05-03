import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { useNotifications } from '../../context/NotificationContext'
import { useLanguage } from '../../context/LanguageContext'
import { api } from '../../utils/api'
import './Reminders.css'

export default function Reminders() {
  const navigate = useNavigate()
  const { showToast, requestBrowserPermission, sendBrowserNotification, getBrowserPermissionStatus } = useNotifications()
  const { t } = useLanguage()
  const [reminders, setReminders] = useState({
    periodApproaching: true,
    ovulationApproaching: true,
    newCycleSummary: true,
    dailyLog: false,
  })

  const [reminderTime, setReminderTime] = useState('09:00')
  const [daysBeforePeriod, setDaysBeforePeriod] = useState(2)

  const handleToggle = (key) => {
    setReminders(prev => ({ ...prev, [key]: !prev[key] }))
  }

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const data = await api.getReminders();
        setReminders({
          periodApproaching: data.period_approaching,
          ovulationApproaching: data.ovulation_approaching,
          newCycleSummary: data.new_cycle_summary ?? true,
          dailyLog: data.daily_log,
        });
        setDaysBeforePeriod(data.days_before_period);
        
        let time = data.reminder_time;
        if (time && time.length > 5) time = time.substring(0, 5);
        setReminderTime(time);
      } catch (err) {
        console.error("Failed to load reminders:", err);
      }
    };
    fetchReminders();
  }, []);

  const handleSave = async () => {
    try {
      await api.updateReminders({
        period_approaching: reminders.periodApproaching,
        days_before_period: daysBeforePeriod,
        ovulation_approaching: reminders.ovulationApproaching,
        new_cycle_summary: reminders.newCycleSummary,
        daily_log: reminders.dailyLog,
        reminder_time: reminderTime,
      });
      showToast(t('remindersSavedSuccess') || 'Reminders saved successfully');
      
      // Clear flags for testing
      localStorage.removeItem('lastGoalReminderDate');
      
      if (reminders.dailyLog && getBrowserPermissionStatus() === 'default') {
        await requestBrowserPermission();
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving reminders', 'error');
    }
  }

  const handleTestNotification = () => {
    sendBrowserNotification(
      "Cleo Test Notification 🌸",
      "This is how your daily reminders will look. Stay healthy!"
    );
  };

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
                      <option value={1}>1 Day</option>
                      <option value={2}>2 Days</option>
                      <option value={3}>3 Days</option>
                    </select>
                  </div>
                )}
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={reminders.periodApproaching} onChange={() => handleToggle('periodApproaching')} />
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
                <input type="checkbox" checked={reminders.ovulationApproaching} onChange={() => handleToggle('ovulationApproaching')} />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="reminder-item">
              <div className="reminder-info">
                <div className="reminder-title-row">
                  <span className="reminder-icon">📊</span>
                  <h4>{t('newCycleSummaryLabel') || 'New Cycle Summary'}</h4>
                </div>
                <p>{t('newCycleSummaryDesc') || 'Get a summary of your next predicted cycle.'}</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={reminders.newCycleSummary} onChange={() => handleToggle('newCycleSummary')} />
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
                <p>{t('dailyCheckInDesc')} & Goal Reminders</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={reminders.dailyLog} onChange={() => handleToggle('dailyLog')} />
                <span className="slider round"></span>
              </label>
            </div>
          </Card>

          <Card className="reminder-settings-card">
            <h3>{t('notificationPrefsLabel')}</h3>
            <div className="reminder-time-setting">
              <label>{t('defaultReminderTime')}</label>
              <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="time-input" />
            </div>
            <p className="reminder-info-tip">💡 The app tab must be open to receive these browser notifications.</p>
            
            <div className="browser-notification-status">
              <div className="status-info">
                <span className="status-label">Browser Notifications:</span>
                <span className={`status-badge ${getBrowserPermissionStatus()}`}>
                  {getBrowserPermissionStatus().toUpperCase()}
                </span>
              </div>
              <div className="status-actions">
                {getBrowserPermissionStatus() !== 'granted' && (
                  <Button variant="secondary" size="small" onClick={requestBrowserPermission}>Enable Notifications</Button>
                )}
                <Button variant="outline" size="small" onClick={handleTestNotification}>Test Notification</Button>
              </div>
            </div>
          </Card>

          <div className="reminders-actions">
            <Button onClick={handleSave} className="save-reminders-btn btn-primary">{t('saveSettings')}</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
