import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Smile, 
  Heart, 
  CloudMoon, 
  Frown, 
  Zap, 
  CloudRain, 
  Meh, 
  Angry, 
  Moon,
  AlertCircle,
  Thermometer,
  Utensils 
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { useLanguage } from '../../context/LanguageContext'
import './Dashboard.css'

export default function Dashboard() {
  const [selectedMood, setSelectedMood] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '' })
  const [user, setUser] = useState(null)
  const [cycleData, setCycleData] = useState(null)
  const { t } = useLanguage()
  const navigate = useNavigate()

  const moods = [
    { label: 'Happy', id: 'happy', icon: <Smile size={24} /> },
    { label: 'Sad', id: 'sad', icon: <Frown size={24} /> },
    { label: 'Angry', id: 'angry', icon: <Angry size={24} /> },
    { label: 'Crying', id: 'crying', icon: <CloudRain size={24} /> },
    { label: 'Energetic', id: 'energetic', icon: <Zap size={24} /> },
    { label: 'Peaceful', id: 'peaceful', icon: <Heart size={24} /> },
    { label: 'Tired', id: 'tired', icon: <CloudMoon size={24} /> },
    { label: 'Neutral', id: 'neutral', icon: <Meh size={24} /> },
    { label: 'Anxious', id: 'anxious', icon: <AlertCircle size={24} /> },
    { label: 'Sleepy', id: 'sleepy', icon: <Moon size={24} /> },
    { label: 'Sick', id: 'sick', icon: <Thermometer size={24} /> },
    { label: 'Hungry', id: 'hungry', icon: <Utensils size={24} /> }
  ]

  const moodMessages = {
    happy: "Keep that beautiful smile! You're glowing! ✨",
    sad: "It's okay to feel this way. Sending you love. 💙",
    angry: "Take a deep breath. You've got this. 😤",
    crying: "Let it out. Better days are ahead. 🌸",
    energetic: "Amazing energy! Crush those goals today! ⚡",
    peaceful: "Stay centered. You're in a great space. ✨",
    tired: "Time for some self-care and rest. 🌙",
    neutral: "A calm, steady day. Enjoy the balance. ⚖️",
    anxious: "One step at a time. You're safe. 🌈",
    sleepy: "Sweet dreams are waiting for you. 💤",
    sick: "Wishing you a speedy recovery! Rest up. 🍵",
    hungry: "Time for a delicious, healthy treat! 🍎"
  }



  const showCuteToast = useCallback((message) => {
    setToast({ show: true, message })
    setTimeout(() => {
      setToast({ show: false, message: '' })
    }, 3000)
  }, [])

  useEffect(() => {
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken')
    if (!authToken) {
      navigate('/login')
      return
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    setUser(userInfo)

    // Mock data for the dashboard elements
    setCycleData({
      firstPeriod: {
        date: 'Feb 28, 2026',
        daysUntil: 14,
        progress: 60
      },
      ovulation: {
        date: 'Feb 21, 2026',
        daysUntil: 7,
        status: 'peak'
      },
      currentCycle: {
        day: 14,
        totalDays: 28,
        percentage: 50
      },
      insights: [
        { id: 1, title: 'Regular Cycle Pattern', description: 'Your cycle has been consistent for the last 03 months.', icon: '📈' },
        { id: 2, title: 'Upcoming Fertile Window', description: 'Fertility window starts next 05 days.', icon: '✨' },
        { id: 3, title: 'Average Cycle Length', description: 'Your average cycle is 28 days.', icon: '⏳' }
      ],
      recentNotes: [
        { id: 1, date: 'Feb 15, 2026', content: 'Feeling slightly better today after the...' },
        { id: 2, date: 'Feb 12, 2026', content: 'Mild cramps in the morning...' },
        { id: 3, date: 'Feb 11, 2026', content: 'The diet seems to be working...' }
      ]
    })
  }, [navigate])

  const handleMoodClick = (mood) => {
    setSelectedMood(mood.label)
    
    // Show cute feedback
    const supportMessage = moodMessages[mood.id] || "Mood logged! Stay wonderful! 🌸"
    showCuteToast(supportMessage)

    // Save to mood history for consistency with the Mood page
    const stored = localStorage.getItem('moodEntries')
    const moodEntries = stored ? JSON.parse(stored) : []
    
    const now = new Date()
    const formattedDate = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    
    const newEntry = {
      id: Date.now(),
      moodId: mood.id,
      label: mood.label,
      date: formattedDate
    }
    
    localStorage.setItem('moodEntries', JSON.stringify([newEntry, ...moodEntries]))
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="dashboard-page-container">
        {/* Welcome Section */}
        <div className="dashboard-welcome">
          <h1>{t('welcome')}, {user.name || 'Hensy'}!</h1>
          <p className="welcome-subtitle">{t('selfCare')}</p>
        </div>

        <div className="dashboard-container">
          {/* Main Content Area */}
          <div className="dashboard-main">

            {/* Summary Row */}
            <div className="summary-row">
              <Card
                className="summary-card period-card"
                hover={true}
                onClick={() => navigate('/calendar')}
              >
                <div className="card-header">
                  <span className="card-label">{t('firstPeriod')}</span>
                  <div className="card-icon-small">📅</div>
                </div>
                <h2 className="card-value">{cycleData?.firstPeriod.date}</h2>
                <p className="card-subtext">in {cycleData?.firstPeriod.daysUntil} days</p>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${cycleData?.firstPeriod.progress}%` }}></div>
                </div>
              </Card>

              <Card
                className="summary-card ovulation-card"
                hover={true}
                onClick={() => navigate('/calendar')}
              >
                <div className="card-header">
                  <span className="card-label">{t('ovulationDay')}</span>
                  <div className="card-icon-small card-icon-heart">💜</div>
                </div>
                <h2 className="card-value">{cycleData?.ovulation.date}</h2>
                <p className="card-subtext">{t('inDays')} {cycleData?.ovulation.daysUntil} {t('days')}</p>
                <span className="status-tag tag-purple">{t('peakStatus')}</span>
              </Card>

              <Card
                className="summary-card cycle-card"
                hover={true}
                onClick={() => navigate('/history')}
              >
                <span className="card-label">{t('currentCycleDay')}</span>
                <div className="cycle-progress-container">
                  <div className="cycle-info">
                    <span className="cycle-day">{cycleData?.currentCycle.day}</span>
                    <span className="cycle-total">{t('of')} {cycleData?.currentCycle.totalDays} {t('days')}</span>
                  </div>
                  <div className="circular-progress">
                    {/* SVG circular progress can be added here or just styled div */}
                    <div className="circular-percentage">50%</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="quick-actions-card">
              <div className="section-header">
                <div className="section-icon">🔘</div>
                <h3>{t('quickActions')}</h3>
              </div>
              <div className="actions-buttons">
                <Button onClick={() => navigate('/log-period')} className="action-btn btn-primary">
                  <span className="btn-icon">+</span> {t('logPeriod')}
                </Button>
                <Button onClick={() => navigate('/notes')} className="action-btn btn-secondary">
                  {t('addNote')}
                </Button>
              </div>
            </Card>

            {/* Mood Section */}
            <Card className="mood-section-card">
              <div className="card-header-with-link">
                <h3>{t('howFeeling')}</h3>
                <button className="view-more-link" onClick={() => navigate('/mood')}>{t('viewMood')}</button>
              </div>
              <div className="mood-buttons">
                {moods.map(mood => (
                  <button
                    key={mood.label}
                    className={`mood-option ${selectedMood === mood.label ? 'active' : ''}`}
                    onClick={() => handleMoodClick(mood)}
                  >
                    <div className="mood-icon-wrapper">{mood.icon}</div>
                    <span className="mood-text">{mood.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Cute Toast Feedback */}
            {toast.show && (
              <div className="cute-toast">
                <span className="toast-content">{toast.message}</span>
              </div>
            )}

            {/* Cycle Insights */}
            <Card className="insights-card">
              <div className="section-header">
                <div className="section-icon">📈</div>
                <h3>{t('cycleInsights')}</h3>
              </div>
              <div className="insights-list">
                {cycleData?.insights.map(insight => (
                  <div key={insight.id} className="insight-item">
                    <div className="insight-icon">{insight.icon}</div>
                    <div className="insight-content">
                      <h4>{insight.title}</h4>
                      <p>{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            {/* Recent Notes */}
            <Card className="recent-notes-card">
              <h3>{t('recentNotes')}</h3>
              <div className="notes-list">
                {cycleData?.recentNotes.map(note => (
                  <div key={note.id} className="note-item">
                    <span className="note-date">{note.date}</span>
                    <p className="note-text">{note.content}</p>
                  </div>
                ))}
              </div>
              <button className="view-all-link" onClick={() => navigate('/notes')}>{t('viewAllNotes')}</button>
            </Card>

            {/* Today's Health Tip */}
            <Card className="health-tip-card">
              <div className="tip-header">
                <span className="tip-icon">💡</span>
                <h3>{t('healthTip')}</h3>
              </div>
              <p className="tip-content">
                Stay hydrated! drinking plenty of water can help reduce bloating and PMS symptoms during your cycle.
              </p>
              <Button variant="secondary" className="tip-btn" onClick={() => navigate('/tips')}>{t('moreTips')}</Button>
            </Card>

            {/* Reminders */}
            <Card className="reminders-card">
              <h3>{t('reminders')}</h3>
              <p>Get notified before your period starts</p>
              <Button variant="secondary" className="manage-btn" onClick={() => navigate('/reminders')}>{t('manageReminders')}</Button>
            </Card>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  )
}
