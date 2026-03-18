import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/common/Button'
import './Mood.css'

export default function Mood() {
  const [moodEntries, setMoodEntries] = useState([])
  const [selectedMood, setSelectedMood] = useState('')
  const [moodDescription, setMoodDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy' },
    { id: 'sad', emoji: '😢', label: 'Sad' },
    { id: 'energetic', emoji: '⚡', label: 'Energetic' },
    { id: 'tired', emoji: '😴', label: 'Tired' },
    { id: 'anxious', emoji: '😰', label: 'Anxious' },
    { id: 'calm', emoji: '😌', label: 'Calm' },
    { id: 'irritable', emoji: '😠', label: 'Irritable' },
    { id: 'neutral', emoji: '😐', label: 'Neutral' }
  ]

  useEffect(() => {
    const stored = localStorage.getItem('moodEntries')
    if (stored) {
      setMoodEntries(JSON.parse(stored))
    }
  }, [])

  const handleAddMood = () => {
    if (!selectedMood) {
      alert('Please select a mood')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      const newEntry = {
        id: Date.now(),
        mood: selectedMood,
        description: moodDescription,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString()
      }

      const updated = [...moodEntries, newEntry]
      setMoodEntries(updated)
      localStorage.setItem('moodEntries', JSON.stringify(updated))
      setSelectedMood('')
      setMoodDescription('')
      setIsLoading(false)
    }, 500)
  }

  const handleDeleteMood = (id) => {
    const updated = moodEntries.filter(entry => entry.id !== id)
    setMoodEntries(updated)
    localStorage.setItem('moodEntries', JSON.stringify(updated))
  }

  return (
    <DashboardLayout>
      <div className="mood-page">
        <div className="mood-container">
          <div className="mood-header">
            <h1>Mood Tracker</h1>
            <p>Track your daily mood and emotional well-being</p>
          </div>

          <div className="mood-section">
            <div className="mood-input-card">
              <h2>How are you feeling today?</h2>
              
              <div className="mood-grid">
                {moods.map(mood => (
                  <button
                    key={mood.id}
                    className={`mood-button ${selectedMood === mood.id ? 'active' : ''}`}
                    onClick={() => setSelectedMood(mood.id)}
                  >
                    <span className="mood-emoji">{mood.emoji}</span>
                    <span className="mood-label">{mood.label}</span>
                  </button>
                ))}
              </div>

              <div className="mood-notes">
                <label htmlFor="mood-description">Add a note (optional)</label>
                <textarea
                  id="mood-description"
                  placeholder="What's on your mind..."
                  value={moodDescription}
                  onChange={(e) => setMoodDescription(e.target.value)}
                  rows="4"
                />
              </div>

              <Button
                variant="primary"
                size="large"
                onClick={handleAddMood}
                disabled={isLoading}
                className="button-full"
              >
                {isLoading ? 'Adding...' : 'Add Mood Entry'}
              </Button>
            </div>
          </div>

          {moodEntries.length > 0 && (
            <div className="mood-history">
              <h2>Your Mood History</h2>
              <div className="mood-entries">
                {moodEntries.slice().reverse().map(entry => {
                  const mood = moods.find(m => m.id === entry.mood)
                  return (
                    <div key={entry.id} className="mood-entry">
                      <div className="entry-header">
                        <span className="entry-emoji">{mood?.emoji}</span>
                        <div className="entry-info">
                          <span className="entry-mood">{mood?.label}</span>
                          <span className="entry-date">{entry.date} {entry.time}</span>
                        </div>
                      </div>
                      {entry.description && (
                        <p className="entry-description">{entry.description}</p>
                      )}
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteMood(entry.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
