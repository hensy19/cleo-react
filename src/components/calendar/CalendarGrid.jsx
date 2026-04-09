import DayCell from './DayCell'
import './CalendarGrid.css'

export default function CalendarGrid({
  year,
  month,
  periodDays = [],
  predictedDays = [],
  onDayClick,
  cycleData = null
}) {
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Calculate cycle phases based on onboarding data
  const calculateCyclePhases = () => {
    if (!cycleData || !cycleData.lastPeriodDate) {
      return { follicularDays: [], ovulationDays: [] }
    }

    const lastPeriodDate = new Date(cycleData.lastPeriodDate)
    const cycleLength = cycleData.cycleLength || 28
    const periodLength = cycleData.periodLength || 5

    const follicularStart = new Date(lastPeriodDate)
    follicularStart.setDate(follicularStart.getDate() + periodLength)
    
    const ovulationStart = new Date(lastPeriodDate)
    ovulationStart.setDate(ovulationStart.getDate() + Math.floor(cycleLength * 0.35)) // ~14 days into cycle

    const follicularDays = []
    const ovulationDays = []

    // Generate follicular phase dates (from end of period to ovulation)
    for (let i = 0; i < 9; i++) {
      const date = new Date(follicularStart)
      date.setDate(date.getDate() + i)
      follicularDays.push(date.toISOString().split('T')[0])
    }

    // Generate ovulation phase dates (5-day window around ovulation)
    for (let i = -2; i <= 2; i++) {
      const date = new Date(ovulationStart)
      date.setDate(date.getDate() + i)
      ovulationDays.push(date.toISOString().split('T')[0])
    }

    return { follicularDays, ovulationDays }
  }

  const { follicularDays, ovulationDays } = calculateCyclePhases()

  // Create array of all days to display
  const days = []

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i)
    })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i)
    })
  }

  // Next month days
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i)
    })
  }

  // Month and year display
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <div className="calendar-grid-container">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={() => {/* previous month */}}>
          <span>&lt;</span>
        </button>
        <h2>{monthNames[month]} {year}</h2>
        <button className="calendar-nav-btn" onClick={() => {/* next month */}}>
          <span>&gt;</span>
        </button>
      </div>

      <div className="calendar-weekdays">
        <div className="weekday">Sun</div>
        <div className="weekday">Mon</div>
        <div className="weekday">Tue</div>
        <div className="weekday">Wed</div>
        <div className="weekday">Thu</div>
        <div className="weekday">Fri</div>
        <div className="weekday">Sat</div>
      </div>

      <div className="calendar-grid">
        {days.map((dayObj, index) => {
          const dateString = dayObj.date.toISOString().split('T')[0]
          const isPeriodDay = periodDays.includes(dateString)
          const isPredictedDay = predictedDays.includes(dateString)
          const isFollicularDay = follicularDays.includes(dateString)
          const isOvulationDay = ovulationDays.includes(dateString)
          const today = new Date()
          const isToday = dateString === today.toISOString().split('T')[0]

          return (
            <DayCell
              key={index}
              day={dayObj.day}
              isCurrentMonth={dayObj.isCurrentMonth}
              isPeriodDay={isPeriodDay}
              isPredictedDay={isPredictedDay}
              isFollicularDay={isFollicularDay}
              isOvulationDay={isOvulationDay}
              isToday={isToday}
              onClick={() => onDayClick?.(dayObj.date)}
            />
          )
        })}
      </div>

      <div className="calendar-legend">
        <div className="legend-label">Legend</div>
        <div className="legend-item">
          <div className="legend-box period-day"></div>
          <span>Period Days</span>
        </div>
        <div className="legend-item">
          <div className="legend-box ovulation-day"></div>
          <span>Ovulation</span>
        </div>
        <div className="legend-item">
          <div className="legend-box fertile-window"></div>
          <span>Fertile Window</span>
        </div>
        <div className="legend-item">
          <div className="legend-box today"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  )
}
