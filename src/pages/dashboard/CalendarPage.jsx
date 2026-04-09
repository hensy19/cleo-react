import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import './CalendarPage.css'

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default function CalendarPage() {
  const navigate = useNavigate()
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalData, setModalData] = useState(null)
  const [periodDays, setPeriodDays] = useState([])
  const [quickNote, setQuickNote] = useState('')

  // Load period days from localStorage
  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem('periodLogs') || '[]')
    const days = []
    logs.forEach(log => {
      if (log.startDate) {
        const start = new Date(log.startDate)
        const length = log.periodLength || log.duration || 5
        for (let i = 0; i < length; i++) {
          const d = new Date(start)
          d.setDate(d.getDate() + i)
          days.push(d.toISOString().split('T')[0])
        }
      }
    })
    setPeriodDays(days)
  }, [])

  // Build calendar days
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()
  const todayStr = today.toISOString().split('T')[0]

  const calendarDays = []
  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    calendarDays.push({ day: d, currentMonth: false, dateStr: formatDateStr(currentYear, currentMonth - 1, d) })
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, currentMonth: true, dateStr: formatDateStr(currentYear, currentMonth, i) })
  }
  // Next month leading days
  const remaining = 42 - calendarDays.length
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({ day: i, currentMonth: false, dateStr: formatDateStr(currentYear, currentMonth + 1, i) })
  }

  function formatDateStr(y, m, d) {
    const date = new Date(y, m, d)
    return date.toISOString().split('T')[0]
  }

  // Get data indicators for a date
  function getDateIndicators(dateStr) {
    const indicators = []
    const isPeriod = periodDays.includes(dateStr)
    if (isPeriod) indicators.push('period')

    const moods = JSON.parse(localStorage.getItem('moodEntries') || '[]')
    const dateParts = dateStr.split('-')
    const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
    const moodDateStr = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    if (moods.some(m => m.date === moodDateStr)) indicators.push('mood')

    const symptoms = JSON.parse(localStorage.getItem('symptomLogs') || '[]')
    if (symptoms.some(s => s.date === dateStr)) indicators.push('symptom')

    const notes = JSON.parse(localStorage.getItem('userNotes') || '[]')
    if (notes.some(n => {
      const noteDate = new Date(n.date || n.createdAt)
      return noteDate.toISOString().split('T')[0] === dateStr
    })) indicators.push('note')

    return indicators
  }

  // Open modal with all data for tapped day
  function handleDayClick(dayObj) {
    if (!dayObj.currentMonth) return
    const dateStr = dayObj.dateStr
    setSelectedDate(dateStr)
    setQuickNote('')

    const dateObj = new Date(dateStr + 'T00:00:00')
    const displayDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    const moodDateStr = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })

    // Moods
    const allMoods = JSON.parse(localStorage.getItem('moodEntries') || '[]')
    const dayMoods = allMoods.filter(m => m.date === moodDateStr)

    // Symptoms
    const allSymptoms = JSON.parse(localStorage.getItem('symptomLogs') || '[]')
    const daySymptoms = allSymptoms.filter(s => s.date === dateStr)

    // Notes
    const allNotes = JSON.parse(localStorage.getItem('userNotes') || '[]')
    const dayNotes = allNotes.filter(n => {
      const noteDate = new Date(n.date || n.createdAt)
      return noteDate.toISOString().split('T')[0] === dateStr
    })

    // Period
    const isPeriod = periodDays.includes(dateStr)

    setModalData({ displayDate, dateStr, dayMoods, daySymptoms, dayNotes, isPeriod })
  }

  // Toggle period day
  function togglePeriodDay() {
    if (!selectedDate) return
    const updated = periodDays.includes(selectedDate)
      ? periodDays.filter(d => d !== selectedDate)
      : [...periodDays, selectedDate]
    setPeriodDays(updated)

    // Also update localStorage periodLogs
    const logs = JSON.parse(localStorage.getItem('periodLogs') || '[]')
    if (periodDays.includes(selectedDate)) {
      // Removing — just update state, simplified approach
    } else {
      logs.push({ startDate: selectedDate, periodLength: 1, id: Date.now() })
    }
    localStorage.setItem('periodLogs', JSON.stringify(logs))

    // Update modal
    setModalData(prev => prev ? { ...prev, isPeriod: !prev.isPeriod } : prev)
  }

  // Save quick note for the selected date
  function saveQuickNote() {
    if (!quickNote.trim() || !selectedDate) return
    const dateObj = new Date(selectedDate + 'T00:00:00')
    const formattedDate = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    const newNote = {
      id: Date.now(),
      title: `Note — ${formattedDate}`,
      content: quickNote,
      date: formattedDate
    }
    const allNotes = JSON.parse(localStorage.getItem('userNotes') || '[]')
    const updated = [newNote, ...allNotes]
    localStorage.setItem('userNotes', JSON.stringify(updated))
    setQuickNote('')
    // Refresh modal data
    setModalData(prev => prev ? { ...prev, dayNotes: [newNote, ...prev.dayNotes] } : prev)
  }

  const handlePrev = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }

  const handleNext = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  const MOOD_EMOJIS = { happy: '😊', calm: '😌', tired: '😴', sad: '😢', energetic: '⚡', angry: '😠', anxious: '😰', peaceful: '💜', neutral: '😐', crying: '😭' }
  const SYMPTOM_EMOJIS = { cramps: '🤕', bloating: '💨', headache: '🧠', fatigue: '⚡', anxiety: '💗', mood: '🎭', energy: '🏃', appetite: '🍽️' }

  return (
    <DashboardLayout>
      <div className="cal-page">
        {/* Header */}
        <div className="cal-header">
          <div className="cal-header-left">
            <Link to="/dashboard" className="cal-back">&larr;</Link>
            <div>
              <h1 className="cal-title">Cycle Calendar</h1>
              <p className="cal-subtitle">Track and manage your cycle</p>
            </div>
          </div>
          <div className="cal-header-actions">
            <button className="cal-btn cal-btn-primary" onClick={() => navigate('/log-period')}>Log Period</button>
            <button className="cal-btn cal-btn-secondary" onClick={() => navigate('/history')}>View History</button>
          </div>
        </div>

        <div className="cal-body">
          {/* Calendar Card */}
          <div className="cal-card">
            <div className="cal-nav">
              <button className="cal-nav-btn" onClick={handlePrev}>&lsaquo;</button>
              <h2 className="cal-month-label">{MONTH_NAMES[currentMonth]} {currentYear}</h2>
              <button className="cal-nav-btn" onClick={handleNext}>&rsaquo;</button>
            </div>

            <div className="cal-weekdays">
              {WEEKDAYS.map(d => <div key={d} className="cal-weekday">{d}</div>)}
            </div>

            <div className="cal-grid">
              {calendarDays.map((dayObj, idx) => {
                const isToday = dayObj.dateStr === todayStr
                const isPeriod = periodDays.includes(dayObj.dateStr)
                const indicators = dayObj.currentMonth ? getDateIndicators(dayObj.dateStr) : []
                const isSelected = dayObj.dateStr === selectedDate

                return (
                  <button
                    key={idx}
                    className={`cal-day ${!dayObj.currentMonth ? 'cal-day-other' : ''} ${isToday ? 'cal-day-today' : ''} ${isPeriod ? 'cal-day-period' : ''} ${isSelected ? 'cal-day-selected' : ''}`}
                    onClick={() => handleDayClick(dayObj)}
                    disabled={!dayObj.currentMonth}
                  >
                    <span className="cal-day-num">{dayObj.day}</span>
                    {indicators.length > 0 && (
                      <div className="cal-day-dots">
                        {indicators.includes('period') && <span className="dot dot-period"></span>}
                        {indicators.includes('mood') && <span className="dot dot-mood"></span>}
                        {indicators.includes('symptom') && <span className="dot dot-symptom"></span>}
                        {indicators.includes('note') && <span className="dot dot-note"></span>}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="cal-legend">
              <div className="cal-legend-item"><span className="dot dot-period"></span> Period</div>
              <div className="cal-legend-item"><span className="dot dot-mood"></span> Mood</div>
              <div className="cal-legend-item"><span className="dot dot-symptom"></span> Symptoms</div>
              <div className="cal-legend-item"><span className="dot dot-note"></span> Notes</div>
              <div className="cal-legend-item"><span className="cal-today-box"></span> Today</div>
            </div>
          </div>
        </div>

        {/* Day Detail Modal */}
        {modalData && (
          <div className="cal-modal-overlay" onClick={() => { setModalData(null); setSelectedDate(null) }}>
            <div className="cal-modal" onClick={e => e.stopPropagation()}>
              <div className="cal-modal-header">
                <h3>{modalData.displayDate}</h3>
                <button className="cal-modal-close" onClick={() => { setModalData(null); setSelectedDate(null) }}>&times;</button>
              </div>

              <div className="cal-modal-body">
                {/* Period Toggle */}
                <div className="cal-modal-section">
                  <div className="cal-modal-section-header">
                    <span className="cal-modal-icon">🩸</span>
                    <h4>Period</h4>
                  </div>
                  <button
                    className={`cal-period-toggle ${modalData.isPeriod ? 'active' : ''}`}
                    onClick={togglePeriodDay}
                  >
                    {modalData.isPeriod ? '✓ Period Day' : 'Mark as Period Day'}
                  </button>
                </div>

                {/* Moods */}
                <div className="cal-modal-section">
                  <div className="cal-modal-section-header">
                    <span className="cal-modal-icon">😊</span>
                    <h4>Mood</h4>
                  </div>
                  {modalData.dayMoods.length > 0 ? (
                    <div className="cal-modal-chips">
                      {modalData.dayMoods.map((m, i) => (
                        <span key={i} className="cal-chip cal-chip-mood">
                          {MOOD_EMOJIS[m.moodId] || '😐'} {m.label}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="cal-modal-empty">No mood logged</p>
                  )}
                </div>

                {/* Symptoms */}
                <div className="cal-modal-section">
                  <div className="cal-modal-section-header">
                    <span className="cal-modal-icon">🤒</span>
                    <h4>Symptoms</h4>
                  </div>
                  {modalData.daySymptoms.length > 0 ? (
                    <div className="cal-modal-chips">
                      {modalData.daySymptoms.flatMap((s, i) =>
                        s.symptoms.map((symptom, j) => (
                          <span key={`${i}-${j}`} className="cal-chip cal-chip-symptom">
                            {SYMPTOM_EMOJIS[symptom] || '•'} {symptom}
                          </span>
                        ))
                      )}
                    </div>
                  ) : (
                    <p className="cal-modal-empty">No symptoms logged</p>
                  )}
                </div>

                {/* Notes */}
                <div className="cal-modal-section">
                  <div className="cal-modal-section-header">
                    <span className="cal-modal-icon">📝</span>
                    <h4>Notes</h4>
                  </div>
                  {modalData.dayNotes.length > 0 ? (
                    <div className="cal-modal-notes">
                      {modalData.dayNotes.map((n, i) => (
                        <div key={i} className="cal-modal-note-card">
                          <strong>{n.title}</strong>
                          <p>{n.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="cal-modal-empty">No notes for this day</p>
                  )}

                  {/* Quick Note Input */}
                  <div className="cal-quick-note">
                    <input
                      type="text"
                      placeholder="Write a quick note..."
                      value={quickNote}
                      onChange={e => setQuickNote(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveQuickNote()}
                    />
                    <button onClick={saveQuickNote} disabled={!quickNote.trim()}>Add</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
