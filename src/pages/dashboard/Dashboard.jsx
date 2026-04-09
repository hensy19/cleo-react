import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import './Dashboard.css'

const MOOD_OPTIONS = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'tired', label: 'Tired', emoji: '😴' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡' },
  { id: 'angry', label: 'Angry', emoji: '😠' },
  { id: 'anxious', label: 'Anxious', emoji: '😰' },
  { id: 'peaceful', label: 'Peaceful', emoji: '💜' }
]

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [cycleData, setCycleData] = useState(null)
  const [selectedMood, setSelectedMood] = useState(null)
  const [todayMood, setTodayMood] = useState(null)
  const [moodToast, setMoodToast] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken')
    if (!authToken) {
      navigate('/login')
      return
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    setUser(userInfo)

    // Check if mood was already logged today
    const storedMoods = JSON.parse(localStorage.getItem('moodEntries') || '[]')
    const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    const todayEntry = storedMoods.find(e => e.date === today)
    if (todayEntry) {
      setTodayMood(todayEntry)
      setSelectedMood(todayEntry.moodId)
    }

    // Load real notes from localStorage, fallback to mock data
    const storedNotes = JSON.parse(localStorage.getItem('userNotes') || '[]')
    const recentNotes = storedNotes.length > 0
      ? storedNotes.slice(0, 3).map((n, i) => ({
          id: n.id || i,
          date: new Date(n.date || n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          content: n.content?.substring(0, 45) + (n.content?.length > 45 ? '...' : '') || n.title || 'No content'
        }))
      : [
          { id: 1, date: 'Feb 15, 2026', content: 'Feeling slightly better today after the...' },
          { id: 2, date: 'Feb 12, 2026', content: 'Mild cramps in the morning...' },
          { id: 3, date: 'Feb 11, 2026', content: 'The diet seems to be working...' }
        ]

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
      recentNotes
    })
  }, [navigate])

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood.id)

    // Save to localStorage in the same format the Mood page uses
    const now = new Date()
    const formattedDate = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })

    const newEntry = {
      id: Date.now(),
      moodId: mood.id,
      label: mood.label,
      date: formattedDate
    }

    const storedMoods = JSON.parse(localStorage.getItem('moodEntries') || '[]')
    // Remove any existing entry for today before adding
    const filtered = storedMoods.filter(e => e.date !== formattedDate)
    const updated = [newEntry, ...filtered]
    localStorage.setItem('moodEntries', JSON.stringify(updated))

    setTodayMood(newEntry)

    // Show toast
    setMoodToast(`Mood saved: ${mood.emoji} ${mood.label}`)
    setTimeout(() => setMoodToast(null), 2500)
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        {/* Main Content Area */}
        <div className="dashboard-main">
          {/* Welcome Section */}
          <div className="dashboard-welcome">
            <h1>Welcome back, {user.name || 'Hensy'}!</h1>
            <p className="welcome-subtitle">There's no better treatment than self-care.</p>
          </div>

          {/* Summary Row */}
          <div className="summary-row">
            <Card className="summary-card period-card">
              <div className="card-header">
                <span className="card-label">First Period</span>
                <div className="card-icon-small">📅</div>
              </div>
              <h2 className="card-value">{cycleData?.firstPeriod.date}</h2>
              <p className="card-subtext">in {cycleData?.firstPeriod.daysUntil} days</p>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${cycleData?.firstPeriod.progress}%` }}></div>
              </div>
            </Card>

            <Card className="summary-card ovulation-card">
              <div className="card-header">
                <span className="card-label">Ovulation Day</span>
                <div className="card-icon-small card-icon-heart">💜</div>
              </div>
              <h2 className="card-value">{cycleData?.ovulation.date}</h2>
              <p className="card-subtext">in {cycleData?.ovulation.daysUntil} days</p>
              <span className="status-tag tag-purple">You are at your peak</span>
            </Card>

            <Card className="summary-card cycle-card">
              <span className="card-label">Current Cycle Day</span>
              <div className="cycle-progress-container">
                <div className="cycle-info">
                  <span className="cycle-day">{cycleData?.currentCycle.day}</span>
                  <span className="cycle-total">of {cycleData?.currentCycle.totalDays} days</span>
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
              <h3>Quick Actions</h3>
            </div>
            <div className="actions-buttons">
              <Button onClick={() => navigate('/log-period')} className="action-btn btn-primary">
                <span className="btn-icon">+</span> Log Period
              </Button>
              <Button onClick={() => navigate('/notes')} className="action-btn btn-secondary">
                Add Note
              </Button>
            </div>
          </Card>

          {/* Mood Section */}
          <Card className="mood-section-card">
            <h3>{todayMood ? `Today you're feeling ${todayMood.label}` : 'How are you feeling today?'}</h3>
            <div className="mood-buttons">
              {MOOD_OPTIONS.map(mood => (
                <button
                  key={mood.id}
                  className={`mood-option ${selectedMood === mood.id ? 'mood-selected' : ''}`}
                  onClick={() => handleMoodSelect(mood)}
                  title={`Log mood as ${mood.label}`}
                >
                  <span className="mood-emoji">{mood.emoji}</span>
                  <span className="mood-label">{mood.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Cycle Insights */}
          <Card className="insights-card">
            <div className="section-header">
              <div className="section-icon">📈</div>
              <h3>Cycle Insights</h3>
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
            <h3>Recent Notes</h3>
            <div className="notes-list">
              {cycleData?.recentNotes.map(note => (
                <div key={note.id} className="note-item">
                  <span className="note-date">{note.date}</span>
                  <p className="note-text">{note.content}</p>
                </div>
              ))}
            </div>
            <button className="view-all-link" onClick={() => navigate('/notes')}>View All Notes</button>
          </Card>

          {/* Today's Health Tip */}
          <Card className="health-tip-card">
            <div className="tip-header">
              <span className="tip-icon">💡</span>
              <h3>Today's Health Tip</h3>
            </div>
            <p className="tip-content">
              Stay hydrated! drinking plenty of water can help reduce bloating and PMS symptoms during your cycle.
            </p>
            <Button variant="secondary" className="tip-btn" onClick={() => navigate('/tips')}>More Tips</Button>
          </Card>

          {/* Reminders */}
          <Card className="reminders-card">
            <h3>Reminders</h3>
            <p>Get notified before your period starts</p>
            <Button variant="secondary" className="manage-btn" onClick={() => navigate('/calendar')}>Manage Reminders</Button>
          </Card>
        </aside>
      </div>

      {/* Mood Toast */}
      {moodToast && (
        <div className="mood-toast">
          {moodToast}
        </div>
      )}
    </DashboardLayout>
  )
}
