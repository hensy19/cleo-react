import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import './Dashboard.css'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [cycleData, setCycleData] = useState(null)
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
            <h3>How are you feeling today?</h3>
            <div className="mood-buttons">
              {['Happy', 'Calm', 'Tired', 'Sad'].map(mood => (
                <button key={mood} className="mood-option">
                  {mood}
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
            <Button variant="secondary" className="tip-btn">More Tips</Button>
          </Card>

          {/* Reminders */}
          <Card className="reminders-card">
            <h3>Reminders</h3>
            <p>Get notified before your period starts</p>
            <Button variant="secondary" className="manage-btn">Manage Reminders</Button>
          </Card>
        </aside>
      </div>
    </DashboardLayout>
  )
}
