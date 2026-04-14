import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import './CalendarPage.css'

export default function CalendarPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  
  const MONTH_NAMES = [
    t('months.jan'), t('months.feb'), t('months.mar'), t('months.apr'), 
    t('months.may'), t('months.jun'), t('months.jul'), t('months.aug'), 
    t('months.sep'), t('months.oct'), t('months.nov'), t('months.dec')
  ]
  const WEEKDAYS = [
    t('weekdays.sun'), t('weekdays.mon'), t('weekdays.tue'), t('weekdays.wed'), 
    t('weekdays.thu'), t('weekdays.fri'), t('weekdays.sat')
  ]

  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalData, setModalData] = useState(null)
  const [periodDays, setPeriodDays] = useState([])
  const [quickNote, setQuickNote] = useState('')
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [tempSelectedDates, setTempSelectedDates] = useState([])
  const [selectedFlow, setSelectedFlow] = useState('Medium')
  const [predictions, setPredictions] = useState({
    ovulation: [],
    fertile: [],
    nextPeriod: []
  })
  const [userInfo, setUserInfo] = useState(null)

  // Load initial data
  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem('periodLogs') || '[]')
    const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
    setUserInfo(user)

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

  // Recalculate predictions whenever period days change
  useEffect(() => {
    if (periodDays.length === 0 && !userInfo?.lastPeriodDate) return

    const cycleLength = userInfo?.cycleLength || 28
    const periodLength = userInfo?.periodLength || 5

    // Combine manual logs and temp selections to find the latest "start"
    const allDays = [...periodDays, ...tempSelectedDates].sort()

    let latestStartStr = userInfo?.lastPeriodDate || null

    if (allDays.length > 0) {
      // Find the start date of the latest contiguous block of period days
      // For simplicity, we take the absolute latest day and look back to find its start
      const latestDay = new Date(allDays[allDays.length - 1])
      let current = new Date(latestDay)

      // Look back through allDays to find the earliest day of this block
      while (allDays.includes(formatDate(current))) {
        latestStartStr = formatDate(current)
        current.setDate(current.getDate() - 1)
      }
    }

    if (latestStartStr) {
      const start = new Date(latestStartStr)

      // Calculate Ovulation (Day 14)
      const ovDate = new Date(start)
      ovDate.setDate(ovDate.getDate() + Math.floor(cycleLength / 2))
      const ovulation = [formatDate(ovDate)]

      // Calculate Fertile Window (Day 9 to Day 14)
      const fertile = []
      for (let i = -5; i <= 0; i++) {
        const d = new Date(ovDate)
        d.setDate(d.getDate() + i)
        fertile.push(formatDate(d))
      }

      // Calculate Next Period (Day 28)
      const nextPeriod = []
      const nextStart = new Date(start)
      nextStart.setDate(nextStart.getDate() + cycleLength)
      for (let i = 0; i < periodLength; i++) {
        const d = new Date(nextStart)
        d.setDate(d.getDate() + i)
        nextPeriod.push(formatDate(d))
      }

      setPredictions({ ovulation, fertile, nextPeriod })
    }
  }, [periodDays, tempSelectedDates, userInfo])

  function formatDate(date) {
    return date.toISOString().split('T')[0]
  }

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

    if (isSelectionMode) {
      setTempSelectedDates(prev =>
        prev.includes(dateStr)
          ? prev.filter(d => d !== dateStr)
          : [...prev, dateStr]
      )
      return
    }

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

  const handleSavePeriod = () => {
    if (tempSelectedDates.length === 0) return

    const logs = JSON.parse(localStorage.getItem('periodLogs') || '[]')

    tempSelectedDates.forEach(date => {
      // Check if already exists to avoid duplicates
      if (!periodDays.includes(date)) {
        logs.push({
          id: Date.now() + Math.random(),
          startDate: date,
          periodLength: 1,
          flow: selectedFlow,
          type: 'manual'
        })
      }
    })

    localStorage.setItem('periodLogs', JSON.stringify(logs))
    setPeriodDays(prev => [...new Set([...prev, ...tempSelectedDates])])
    setTempSelectedDates([])
    setIsSelectionMode(false)
  }

  const FLOW_OPTIONS = [
    { id: 'Light', label: t('light'), icon: '🩸' },
    { id: 'Medium', label: t('medium'), icon: '🩸' },
    { id: 'Heavy', label: t('heavy'), icon: '🩸' },
    { id: 'Super Heavy', label: t('superFlow'), icon: '🩸' }
  ]

  const MOOD_EMOJIS = { happy: '😊', calm: '😌', tired: '😴', sad: '😢', energetic: '⚡', angry: '😠', anxious: '😰', peaceful: '💜', neutral: '😐', crying: '😭' }
  const SYMPTOM_EMOJIS = { cramps: '🤕', bloating: '💨', headache: '🧠', fatigue: '⚡', anxiety: '💗', mood: '🎭', energy: '🏃', appetite: '🍽️' }

  return (
    <DashboardLayout>
      <div className="cal-page">
        {/* Header */}
        <div className="cal-header">
          <div className="cal-header-left">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              <ChevronLeft size={20} />
              <div className="title-group">
                <h1 className="cal-title">{t('cycleCalendar')}</h1>
                <p className="cal-subtitle">{t('trackManageCycle')}</p>
              </div>
            </button>
          </div>
          <div className="cal-header-actions">
            <button
              className={`cal-mode-toggle ${isSelectionMode ? 'active' : ''}`}
              onClick={() => {
                setIsSelectionMode(!isSelectionMode)
                setTempSelectedDates([])
              }}
              title="Track Period"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill={isSelectionMode ? "#EF4444" : "none"} stroke={isSelectionMode ? "none" : "currentColor"} strokeWidth="2">
                <path d="M12 2.5C12 2.5 6 10 6 15.5C6 18.5 8.5 21 12 21C15.5 21 18 18.5 18 15.5C18 10 12 2.5 12 2.5Z" />
              </svg>
            </button>
            <button className="cal-btn cal-btn-primary" onClick={() => navigate('/log-period')}>{t('logPeriod')}</button>
            <button className="cal-btn cal-btn-secondary" onClick={() => navigate('/history')}>{t('viewHistory')}</button>
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
                const isTempSelected = tempSelectedDates.includes(dayObj.dateStr)

                // Predictions
                const isOvulation = predictions.ovulation.includes(dayObj.dateStr)
                const isFertile = predictions.fertile.includes(dayObj.dateStr)
                const isPredicted = predictions.nextPeriod.includes(dayObj.dateStr)

                const indicators = dayObj.currentMonth ? getDateIndicators(dayObj.dateStr) : []
                const isSelected = dayObj.dateStr === selectedDate

                let statusClasses = ''
                if (isToday) statusClasses += ' cal-day-today'
                if (isPeriod) statusClasses += ' cal-day-period'
                if (isSelected) statusClasses += ' cal-day-selected'
                if (isTempSelected) statusClasses += ' cal-day-temp-selected'
                if (isSelectionMode) statusClasses += ' selection-mode'

                // Prediction classes (only if not a current/temp period day)
                if (!isPeriod && !isTempSelected) {
                  if (isOvulation) statusClasses += ' cal-day-ovulation'
                  else if (isFertile) statusClasses += ' cal-day-fertile'
                  else if (isPredicted) statusClasses += ' cal-day-predicted'
                }

                return (
                  <button
                    key={idx}
                    className={`cal-day ${!dayObj.currentMonth ? 'cal-day-other' : ''}${statusClasses}`}
                    onClick={() => handleDayClick(dayObj)}
                    disabled={!dayObj.currentMonth}
                  >
                    {dayObj.currentMonth && (isSelectionMode || isPeriod) && (
                      <div className={`selection-drop ${(isTempSelected || isPeriod) ? 'filled' : ''}`}>
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path d="M12 2.5C12 2.5 6 10 6 15.5C6 18.5 8.5 21 12 21C15.5 21 18 18.5 18 15.5C18 10 12 2.5 12 2.5Z" />
                        </svg>
                      </div>
                    )}
                    <span className="cal-day-num">{dayObj.day}</span>
                    {indicators.length > 0 && !isSelectionMode && (
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

            {/* Cycle Prediction Legend */}
            <div className="cal-legend">
              <div className="cal-legend-item">
                <span className="legend-indicator period"></span>
                <span className="legend-label">{t('periodDays')}</span>
              </div>
              <div className="cal-legend-item">
                <span className="legend-indicator fertile"></span>
                <span className="legend-label">{t('fertileWindow')}</span>
              </div>
              <div className="cal-legend-item">
                <span className="legend-indicator ovulation"></span>
                <span className="legend-label">{t('ovulationDay')}</span>
              </div>
              <div className="cal-legend-item">
                <span className="legend-indicator predicted"></span>
                <span className="legend-label">{t('predictedPeriod')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Period Selection Bottom Panel */}
        {isSelectionMode && (
          <div className="period-selection-panel">
            <div className="panel-content">
              <div className="panel-header">
                <h3>{t('periodFlow')}</h3>
                <span className="selected-count">{tempSelectedDates.length} {t('daysSelected')}</span>
              </div>

              <div className="flow-selector">
                {FLOW_OPTIONS.map(flow => (
                  <button
                    key={flow.id}
                    className={`flow-opt ${selectedFlow === flow.id ? 'active' : ''}`}
                    onClick={() => setSelectedFlow(flow.id)}
                  >
                    <div className="flow-icon-wrap">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path d="M12 2.5C12 2.5 6 10 6 15.5C6 18.5 8.5 21 12 21C15.5 21 18 18.5 18 15.5C18 10 12 2.5 12 2.5Z" />
                      </svg>
                    </div>
                    <span>{flow.label}</span>
                  </button>
                ))}
              </div>

              <button
                className="save-period-btn"
                onClick={handleSavePeriod}
                disabled={tempSelectedDates.length === 0}
              >
                {t('saveAll')}
              </button>
            </div>
          </div>
        )}

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
                    <h4>{t('periodCycle')}</h4>
                  </div>
                  <button
                    className={`cal-period-toggle ${modalData.isPeriod ? 'active' : ''}`}
                    onClick={togglePeriodDay}
                  >
                    {modalData.isPeriod ? t('periodDayActive') : t('markPeriodDay')}
                  </button>
                </div>

                {/* Moods */}
                <div className="cal-modal-section">
                  <div className="cal-modal-section-header">
                    <span className="cal-modal-icon">😊</span>
                    <h4>{t('mood')}</h4>
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
                    <p className="cal-modal-empty">{t('noMoodLogged')}</p>
                  )}
                </div>

                {/* Symptoms */}
                <div className="cal-modal-section">
                  <div className="cal-modal-section-header">
                    <span className="cal-modal-icon">🤒</span>
                    <h4>{t('symptoms')}</h4>
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
                    <p className="cal-modal-empty">{t('noSymptomsLogged')}</p>
                  )}
                </div>

                {/* Notes */}
                <div className="cal-modal-section">
                  <div className="cal-modal-section-header">
                    <span className="cal-modal-icon">📝</span>
                    <h4>{t('notes')}</h4>
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
                    <p className="cal-modal-empty">{t('noNotesForDay')}</p>
                  )}

                  {/* Quick Note Input */}
                  <div className="cal-quick-note">
                    <input
                      type="text"
                      placeholder={t('writeQuickNote')}
                      value={quickNote}
                      onChange={e => setQuickNote(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveQuickNote()}
                    />
                    <button onClick={saveQuickNote} disabled={!quickNote.trim()}>{t('add')}</button>
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
