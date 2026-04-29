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
import { useSettings } from '../../context/SettingsContext'
import './Dashboard.css'
import { calculatePredictions, getCycleDay, daysUntil, formatDateToISO } from '../../utils/cycleUtils'
import { formatDate } from '../../utils/helpers'
import { api } from '../../utils/api'

export default function Dashboard() {
  const { settings } = useSettings()
  const [selectedMood, setSelectedMood] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '' })
  const [user, setUser] = useState(null)
  const [cycleData, setCycleData] = useState({
    firstPeriod: { date: '—', daysUntil: 0, progress: 0 },
    ovulation: { date: '—', daysUntil: 0, status: '' },
    currentCycle: { day: 0, totalDays: 28, percentage: 0 },
    insights: [],
    recentNotes: []
  })
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

    const loadData = async () => {
      try {
        // Fetch fresh profile data to ensure predictions are accurate after login
        const profile = await api.getProfile();
        const updatedUserInfo = {
          ...profile,
          cycleLength: profile.cycle_length,
          periodLength: profile.period_length,
          lastPeriodDate: profile.last_period_date
        };

        // Update local storage so other components have fresh data
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        setUser(updatedUserInfo);

        // Calculate real data based on user cycle settings
        const lastStart = updatedUserInfo.lastPeriodDate;
        const cycleLen = parseInt(updatedUserInfo.cycleLength || 28);
        const periodLen = parseInt(updatedUserInfo.periodLength || 5);

        if (lastStart) {
          const predictions = calculatePredictions(lastStart, cycleLen, periodLen)
          const nextPeriodDate = predictions.nextPeriod[0]
          const ovulationDate = predictions.ovulation[0]
          const currentDay = getCycleDay(lastStart)
          const daysLeft = daysUntil(nextPeriodDate)
          const daysToOv = daysUntil(ovulationDate)

          setCycleData({
            firstPeriod: {
              date: formatDate(nextPeriodDate),
              daysUntil: daysLeft,
              progress: Math.min(100, Math.max(0, ((cycleLen - daysLeft) / cycleLen) * 100))
            },
            ovulation: {
              date: formatDate(ovulationDate),
              daysUntil: Math.max(0, daysToOv),
              status: daysToOv <= 2 && daysToOv >= 0 ? 'peak' : 'approaching'
            },
            currentCycle: {
              day: currentDay || 0,
              totalDays: cycleLen,
              percentage: currentDay ? Math.min(100, (currentDay / cycleLen) * 100) : 0
            },
            insights: [
              { id: 1, title: 'Regular Cycle Pattern', description: `Your cycle is set to ${cycleLen} days.`, icon: '📈' },
              { id: 2, title: 'Upcoming Fertile Window', description: `Fertility window starts in about ${Math.max(0, daysToOv - 5)} days.`, icon: '✨' },
              { id: 3, title: 'Average Cycle Length', description: `Your average cycle is ${cycleLen} days.`, icon: '⏳' }
            ],
            recentNotes: []
          })
        }

        // Fetch recent notes from database
        const notesData = await api.getNotes().catch(() => []);
        const recentNotesFromDB = notesData.slice(0, 3).map(n => ({
          id: n.id,
          date: new Date(n.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          content: n.title || n.content
        }));

        setCycleData(prev => ({
          ...(prev || {}),
          recentNotes: recentNotesFromDB
        }));

        // Fetch recommended health tip
        const tipData = await api.getTipRecommendation().catch(() => null);
        if (tipData) {
          setCycleData(prev => ({
            ...(prev || {}),
            recommendedTip: tipData.content
          }));
        }

        // Fetch today's mood to sync with Mood page
        const moodsData = await api.getMoods().catch(() => []);
        const today = new Date().toISOString().split('T')[0];
        const todayMood = moodsData.find(m => m.date.split('T')[0] === today);
        if (todayMood) {
          const moodInfo = moods.find(m => m.id === todayMood.mood_id);
          if (moodInfo) setSelectedMood(moodInfo.label);
        }


      } catch (error) {
        console.error("Failed to load user profile:", error);
        // fallback to localStorage if offline or error
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        setUser(userInfo);
      }
    };

    loadData();
  }, [navigate])

  const handleMoodClick = async (mood) => {
    setSelectedMood(mood.label)

    // Show cute feedback
    const supportMessage = moodMessages[mood.id] || "Mood logged! Stay wonderful! 🌸"
    showCuteToast(supportMessage)

    // Save to database to sync with Mood page
    try {
      const now = new Date()
      const isoDate = now.toISOString().split('T')[0]

      await api.logMood({
        date: isoDate,
        mood_id: mood.id
      })
    } catch (err) {
      console.error("Error logging mood from dashboard:", err)
    }
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
            {settings.showCycleSummary !== false && (
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
                  <h2 className="card-value">{cycleData?.firstPeriod?.date || '—'}</h2>
                  <p className="card-subtext">in {cycleData?.firstPeriod?.daysUntil || 0} days</p>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${cycleData?.firstPeriod?.progress || 0}%` }}></div>
                  </div>
                </Card>

                {settings.enableOvulationDisplay !== false && (
                  <Card
                    className="summary-card ovulation-card"
                    hover={true}
                    onClick={() => navigate('/calendar')}
                  >
                    <div className="card-header">
                      <span className="card-label">{t('ovulationDay')}</span>
                      <div className="card-icon-small card-icon-heart">💜</div>
                    </div>
                    <h2 className="card-value">{cycleData?.ovulation?.date || '—'}</h2>
                    <p className="card-subtext">{t('inDays')} {cycleData?.ovulation?.daysUntil || 0} {t('days')}</p>
                    <span className="status-tag tag-purple">{t('peakStatus')}</span>
                  </Card>
                )}

                <Card
                  className="summary-card cycle-card"
                  hover={true}
                  onClick={() => navigate('/history')}
                >
                  <span className="card-label">{t('currentCycleDay')}</span>
                  <div className="cycle-progress-container">
                    <div className="cycle-info">
                      <span className="cycle-day">{cycleData?.currentCycle?.day || 0}</span>
                      <span className="cycle-total">{t('of')} {cycleData?.currentCycle?.totalDays || 28} {t('days')}</span>
                    </div>
                    <div className="circular-progress">
                      {/* SVG circular progress can be added here or just styled div */}
                      <div className="circular-percentage">50%</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

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
                {cycleData?.insights?.map(insight => (
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
            {/* User Profile Summary */}
            <Card className="user-profile-summary-card">
              <h3>{user.name}</h3>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-label">Age</span>
                  <span className="stat-value">{user.age || '—'} yrs</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Cycle</span>
                  <span className="stat-value">{user.cycleLength || '—'} days</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Period</span>
                  <span className="stat-value">{user.periodLength || '—'} days</span>
                </div>
              </div>
              <button className="edit-profile-btn" onClick={() => navigate('/profile')}>Edit Profile</button>
            </Card>

            {/* Recent Notes */}
            <Card className="recent-notes-card">
              <h3>{t('recentNotes')}</h3>
              <div className="notes-list">
                {cycleData?.recentNotes?.map(note => (
                  <div key={note.id} className="note-item">
                    <span className="note-date">{note.date}</span>
                    <p className="note-text">{note.content}</p>
                  </div>
                ))}
              </div>
              <button className="view-all-link" onClick={() => navigate('/notes')}>{t('viewAllNotes')}</button>
            </Card>

            {/* Today's Health Tip */}
            {settings.showTips !== false && (
              <Card className="health-tip-card">
                <div className="tip-header">
                  <span className="tip-icon">💡</span>
                  <h3>{t('healthTip')}</h3>
                </div>
                <p className="tip-content">
                  {cycleData?.recommendedTip || "Stay hydrated! drinking plenty of water can help reduce bloating and PMS symptoms during your cycle."}
                </p>
                <Button variant="secondary" className="tip-btn" onClick={() => navigate('/tips')}>{t('moreTips')}</Button>
              </Card>
            )}

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
