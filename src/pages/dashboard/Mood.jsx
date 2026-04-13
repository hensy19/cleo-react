import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Smile,
  Frown,
  Angry,
  CloudRain,
  Zap,
  Heart,
  CloudMoon,
  Meh,
  AlertCircle,
  Moon,
  Thermometer,
  Utensils,
  ChevronLeft
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import './Mood.css'

export default function Mood() {
  const [moodEntries, setMoodEntries] = useState([])
  const [selectedMood, setSelectedMood] = useState(null)
  const [suggestedTip, setSuggestedTip] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const moods = [
    { id: 'happy', icon: <Smile size={32} />, label: 'Happy' },
    { id: 'sad', icon: <Frown size={32} />, label: 'Sad' },
    { id: 'angry', icon: <Angry size={32} />, label: 'Angry' },
    { id: 'crying', icon: <CloudRain size={32} />, label: 'Crying' },
    { id: 'energetic', icon: <Zap size={32} />, label: 'Energetic' },
    { id: 'peaceful', icon: <Heart size={32} />, label: 'Peaceful' },
    { id: 'tired', icon: <CloudMoon size={32} />, label: 'Tired' },
    { id: 'neutral', icon: <Meh size={32} />, label: 'Neutral' },
    { id: 'anxious', icon: <AlertCircle size={32} />, label: 'Anxious' },
    { id: 'sleepy', icon: <Moon size={32} />, label: 'Sleepy' },
    { id: 'sick', icon: <Thermometer size={32} />, label: 'Sick' },
    { id: 'hungry', icon: <Utensils size={32} />, label: 'Hungry' }
  ]

  useEffect(() => {
    const stored = localStorage.getItem('moodEntries')
    if (stored) {
      setMoodEntries(JSON.parse(stored))
    }
  }, [])

  const handleSaveMood = () => {
    if (!selectedMood) return

    setIsLoading(true)
    const selected = moods.find(m => m.id === selectedMood)

    setTimeout(() => {
      const now = new Date()
      const formattedDate = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })

      const newEntry = {
        id: Date.now(),
        moodId: selected.id,
        label: selected.label,
        date: formattedDate
      }

      const updated = [newEntry, ...moodEntries]
      setMoodEntries(updated)
      localStorage.setItem('moodEntries', JSON.stringify(updated))

      // Select a relevant tip
      const tipsMapping = {
        'tired': { title: 'Sleep Quality', content: 'Aim for 7-8 hours of quality sleep. Poor sleep can worsen PMS symptoms and irregular cycles.', color: 'purple' },
        'anxious': { title: 'Stress Management', content: 'Practice meditation or deep breathing. Stress can affect your menstrual regularity.', color: 'purple' },
        'sad': { title: 'Exercise Benefits', content: 'Gentle yoga or walking can help reduce cramps and improve mood during your period.', color: 'blue' },
        'energetic': { title: 'Strength Training', content: 'Regular strength training can help reduce period pain and regulate hormones.', color: 'blue' }
      }

      setSuggestedTip(tipsMapping[selected.id] || {
        title: 'Stay Hydrated',
        content: 'Drinking plenty of water helps reduce bloating and fatigue throughout your cycle.',
        color: 'green'
      })

      setIsLoading(false)
    }, 800)
  }

  const getMoodIcon = (moodId) => {
    return moods.find(m => m.id === moodId)?.icon
  }

  return (
    <DashboardLayout>
      <div className="mood-board-page">
        <div className="mood-board-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <ChevronLeft size={20} />
            <span>Visual Mood Board</span>
          </button>
          <p>Track your daily mood throughout your cycle.</p>
        </div>

        {!suggestedTip ? (
          <>
            <div className="mood-selection-card">
              <div className="selection-inner">
                <div className="selection-header">
                  <h3>How are you feeling today?</h3>
                  <p>Select your current mood</p>
                </div>

                <div className="mood-icons-row">
                  {moods.map(mood => (
                    <button
                      key={mood.id}
                      className={`mood-square-btn ${selectedMood === mood.id ? 'active' : ''}`}
                      onClick={() => setSelectedMood(mood.id)}
                    >
                      <div className="mood-icon-wrapper">{mood.icon}</div>
                      <span className="mood-label-text">{mood.label}</span>
                    </button>
                  ))}
                </div>

                <div className="selection-footer">
                  <button
                    className="save-mood-pill-btn"
                    onClick={handleSaveMood}
                    disabled={!selectedMood || isLoading}
                  >
                    {isLoading ? 'Saving...' : '+ Save Mood'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mood-history-section">
              <h3>Mood History</h3>
              <div className="mood-history-list">
                {moodEntries.map(entry => (
                  <div key={entry.id} className="mood-history-item">
                    <div className="history-icon-circle">
                      {getMoodIcon(entry.moodId)}
                    </div>
                    <div className="history-info">
                      <span className="history-mood-name">{entry.label}</span>
                      <span className="history-mood-date">{entry.date}</span>
                    </div>
                  </div>
                ))}

                {moodEntries.length === 0 && (
                  <div className="empty-history-placeholder">
                    <p>No mood entries yet. Select a mood above to start tracking!</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="mood-suggestion-overlay">
            <div className="suggestion-card-container">
              <div className="success-badge">Recommended for You</div>
              <h2>Great job logging your mood!</h2>
              <p className="suggestion-intro">Based on how you're feeling, we thought this might help:</p>

              <div className="modern-tip-card suggestion-card">
                <div className={`tip-card-header ${suggestedTip.color}`}>
                  <div className="tip-icon-bubble">
                    <span role="img" aria-label="lightbulb">💡</span>
                  </div>
                </div>
                <div className="tip-card-content">
                  <h3>{suggestedTip.title}</h3>
                  <p>{suggestedTip.content}</p>
                </div>
              </div>

              <div className="suggestion-actions">
                <button className="finish-btn-modern" onClick={() => navigate('/dashboard')}>
                  Finish & Go to Dashboard
                </button>
                <button className="log-another-btn" onClick={() => setSuggestedTip(null)}>
                  Log Another Mood
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mood-insight-box">
          <h4>Pattern Insight</h4>
          <p>
            You tend to feel more energetic and happy during the follicular phase of your cycle.
            Consider planning important activities during this time!
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
