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
import { useLanguage } from '../../context/LanguageContext'
import { api } from '../../utils/api'
import './Mood.css'

export default function Mood() {
  const [moodEntries, setMoodEntries] = useState([])
  const [selectedMood, setSelectedMood] = useState(null)
  const [suggestedTip, setSuggestedTip] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useLanguage()

  const moods = [
    { id: 'happy', icon: <Smile size={32} />, label: t('happy') },
    { id: 'sad', icon: <Frown size={32} />, label: t('sad') },
    { id: 'angry', icon: <Angry size={32} />, label: t('angry') },
    { id: 'crying', icon: <CloudRain size={32} />, label: t('crying') },
    { id: 'energetic', icon: <Zap size={32} />, label: t('energetic') },
    { id: 'peaceful', icon: <Heart size={32} />, label: t('peaceful') },
    { id: 'tired', icon: <CloudMoon size={32} />, label: t('tired') },
    { id: 'neutral', icon: <Meh size={32} />, label: t('neutral') },
    { id: 'anxious', icon: <AlertCircle size={32} />, label: t('anxious') },
    { id: 'sleepy', icon: <Moon size={32} />, label: t('sleepy') },
    { id: 'sick', icon: <Thermometer size={32} />, label: t('sick') },
    { id: 'hungry', icon: <Utensils size={32} />, label: t('hungry') }
  ]

  useEffect(() => {
    fetchMoods()
  }, [])

  const fetchMoods = async () => {
    try {
      const data = await api.getMoods()
      const processed = data.map(entry => {
        const selected = moods.find(m => m.id === entry.mood_id)
        return {
          id: entry.id,
          moodId: entry.mood_id,
          label: selected ? selected.label : entry.mood_id,
          date: new Date(entry.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
        }
      })
      setMoodEntries(processed)
    } catch (err) {
      console.error("Failed to fetch moods:", err)
    }
  }

  const handleSaveMood = async () => {
    if (!selectedMood) return

    setIsLoading(true)
    const selected = moods.find(m => m.id === selectedMood)
    const now = new Date()
    const isoDate = now.toISOString().split('T')[0]

    try {
      const response = await api.logMood({
        date: isoDate,
        mood_id: selectedMood
      })

      fetchMoods()

      // Use the recommendation returned from the Backend
      setSuggestedTip(response.recommendation || {
        title: t('stayHydrated'),
        content: t('hygieneTip'),
        color: 'green'
      })
    } catch (err) {
      console.error("Error saving mood:", err)
    } finally {
      setIsLoading(false)
    }
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
            <span>{t('visualMoodBoard')}</span>
          </button>
          <p>{t('trackDailyMood')}</p>
        </div>

        {!suggestedTip ? (
          <>
            <div className="mood-selection-card">
              <div className="selection-inner">
                <div className="selection-header">
                  <h3>{t('howFeeling')}</h3>
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
                    {isLoading ? t('saving') : `+ ${t('save')} ${t('mood')}`}
                  </button>
                </div>
              </div>
            </div>

            <div className="mood-history-section">
              <h3>{t('moodHistory')}</h3>
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
                    <p>{t('noMoodEntries')}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="mood-suggestion-overlay">
            <div className="suggestion-card-container">
              <div className="success-badge">{t('recommendedForYou')}</div>
              <h2>{t('greatJobLogging')}</h2>
              <p className="suggestion-intro">{t('suggestedHelp')}</p>

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
                  {t('finishAndGo')}
                </button>
                <button className="log-another-btn" onClick={() => setSuggestedTip(null)}>
                  {t('logAnother')}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mood-insight-box">
          <h4>{t('patternInsight')}</h4>
          <p>{t('insightText')}</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
