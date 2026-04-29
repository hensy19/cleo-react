import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useLanguage } from '../../context/LanguageContext'
import { useSettings } from '../../context/SettingsContext'
import { calculatePredictions } from '../../utils/cycleUtils'
import { api } from '../../utils/api'
import './CalendarPage.css'

export default function CalendarPage() {
  const { settings } = useSettings()
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
  const [allMoods, setAllMoods] = useState([])
  const [allSymptoms, setAllSymptoms] = useState([])
  const [allNotes, setAllNotes] = useState([])

  // Load initial data from API
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
    setUserInfo(user)
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const [periods, moods, symptoms, notes, profile] = await Promise.all([
        api.getPeriods(),
        api.getMoods(),
        api.getSymptoms(),
        api.getNotes(),
        api.getProfile()
      ])

      // Update user info with fresh profile data
      const updatedUser = {
        ...profile,
        cycleLength: profile.cycle_length,
        periodLength: profile.period_length,
        lastPeriodDate: profile.last_period_date
      }
      setUserInfo(updatedUser)
      localStorage.setItem('userInfo', JSON.stringify(updatedUser))

      const days = []
      periods.forEach(log => {
        if (log.start_date) {
          const start = new Date(log.start_date)
          let length = 5
          if (log.end_date) {
            const end = new Date(log.end_date)
            length = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1
          }
          for (let i = 0; i < length; i++) {
            const d = new Date(start)
            d.setDate(d.getDate() + i)
            days.push(formatDate(d))
          }
        }
      })

      setPeriodDays(days)
      setAllMoods(moods)
      setAllSymptoms(symptoms)
      setAllNotes(notes)
    } catch (err) {
      console.error("Failed to fetch calendar data:", err)
    }
  }

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
      const preds = calculatePredictions(latestStartStr, cycleLength, periodLength)
      setPredictions(preds)
    }
  }, [periodDays, tempSelectedDates, userInfo])

  function formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const toLocalISO = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return formatDate(date);
  }

  // Build calendar days
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()
  const todayStr = formatDate(today)

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
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Get data indicators for a date
  function getDateIndicators(dateStr) {
    const indicators = []
    const isPeriod = periodDays.includes(dateStr)
    if (isPeriod) indicators.push('period')

    // Moods
    const dateObj = new Date(dateStr + 'T00:00:00')
    const moodDateStr = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    if (allMoods.some(m => {
      const mDate = new Date(m.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
      return mDate === moodDateStr
    })) indicators.push('mood')

    // Symptoms
    if (allSymptoms.some(s => {
      const sDate = toLocalISO(s.date)
      return sDate === dateStr
    })) indicators.push('symptom')

    // Notes
    if (allNotes.some(n => {
      const nDate = toLocalISO(n.date)
      return nDate === dateStr
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

    // Filter data for the specific day
    const dayMoods = allMoods.filter(m => {
      const mDate = new Date(m.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
      return mDate === moodDateStr
    }).map(m => {
      const selected = Object.keys(MOOD_EMOJIS).find(key => key === m.mood_id)
      return { ...m, moodId: m.mood_id, label: m.mood_id }
    })

    const daySymptoms = allSymptoms.filter(s => {
      const sDate = toLocalISO(s.date)
      return sDate === dateStr
    })

    const dayNotes = allNotes.filter(n => {
      const nDate = toLocalISO(n.date)
      return nDate === dateStr
    })

    const isPeriod = periodDays.includes(dateStr)

    setModalData({ displayDate, dateStr, dayMoods, daySymptoms, dayNotes, isPeriod })
  }

  // Toggle period day (marks a single day as start of period for simplicity)
  async function togglePeriodDay() {
    if (!selectedDate) return
    const isAlreadyPeriod = periodDays.includes(selectedDate)
    
    if (!isAlreadyPeriod) {
      try {
        await api.logPeriod({
          start_date: selectedDate,
          end_date: selectedDate,
          flow: 'medium'
        })
        fetchAllData()
        setModalData(prev => prev ? { ...prev, isPeriod: true } : prev)
      } catch (err) {
        console.error("Error logging period day:", err)
      }
    }
  }

  // Save quick note for the selected date
  async function saveQuickNote() {
    if (!quickNote.trim() || !selectedDate) return
    try {
      await api.createNote({
        date: selectedDate,
        title: `Note — ${selectedDate}`,
        content: quickNote
      })
      setQuickNote('')
      fetchAllData()
      // Refresh modal data will happen after fetchAllData updates the state
    } catch (err) {
      console.error("Error saving quick note:", err)
    }
  }

  const handlePrev = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }

  const handleNext = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  const handleSavePeriod = async () => {
    if (tempSelectedDates.length === 0) return

    setIsLoading(true)
    try {
      // Find the min and max dates from tempSelectedDates to log as a block
      const sortedDates = [...tempSelectedDates].sort()
      const startDate = sortedDates[0]
      const endDate = sortedDates[sortedDates.length - 1]

      await api.logPeriod({
        start_date: startDate,
        end_date: endDate,
        flow: selectedFlow
      })

      fetchAllData()
      setTempSelectedDates([])
      setIsSelectionMode(false)
    } catch (err) {
      console.error("Error saving period block:", err)
    } finally {
      setIsLoading(false)
    }
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
                  if (isOvulation && settings.enableOvulationDisplay !== false) statusClasses += ' cal-day-ovulation'
                  else if (isFertile && settings.enableOvulationDisplay !== false) statusClasses += ' cal-day-fertile'
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
              {settings.enableOvulationDisplay !== false && (
                <>
                  <div className="cal-legend-item">
                    <span className="legend-indicator fertile"></span>
                    <span className="legend-label">{t('fertileWindow')}</span>
                  </div>
                  <div className="cal-legend-item">
                    <span className="legend-indicator ovulation"></span>
                    <span className="legend-label">{t('ovulationDay')}</span>
                  </div>
                </>
              )}
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
