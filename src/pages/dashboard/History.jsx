import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import { useLanguage } from '../../context/LanguageContext'
import { api } from '../../utils/api'
import { calculatePredictions } from '../../utils/cycleUtils'
import './History.css'

/**
 * Convert an ISO date string from the DB to a local YYYY-MM-DD string.
 * This accounts for the timezone offset so that a date stored as
 * "2026-04-06T18:30:00.000Z" (IST midnight) is shown as "2026-04-07".
 */
const toLocalDateStr = (isoStr) => {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  if (isNaN(d.getTime())) return ''
  // Offset the UTC time by the local timezone to get the local date
  const offset = d.getTimezoneOffset() * 60000
  const localDate = new Date(d.getTime() - offset)
  return localDate.toISOString().split('T')[0]
}

/**
 * Format a local YYYY-MM-DD string (or ISO string) to a readable display.
 * Always interprets the date as local to avoid timezone shifts.
 */
const toDisplayDate = (isoStr) => {
  if (!isoStr) return '-'
  const localStr = toLocalDateStr(isoStr)
  if (!localStr) return '-'
  const [year, month, day] = localStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function History() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [periodHistory, setPeriodHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [editFormData, setEditFormData] = useState({
    startDate: '',
    endDate: '',
    flow: ''
  })

  const [stats, setStats] = useState({
    totalCycles: 0,
    avgCycle: 28,
    lastPeriod: '-',
    nextExpected: '-'
  })

  useEffect(() => {
    fetchPeriods()
  }, [])

  const fetchPeriods = async () => {
    setIsLoading(true)
    try {
      const data = await api.getPeriods()

      const processed = data.map((item, index) => {
        const localStart = toLocalDateStr(item.start_date)
        const localEnd = toLocalDateStr(item.end_date)

        let lengthStr = '-'
        if (localStart && localEnd) {
          const [sy, sm, sd] = localStart.split('-').map(Number)
          const [ey, em, ed] = localEnd.split('-').map(Number)
          const start = new Date(sy, sm - 1, sd)
          const end = new Date(ey, em - 1, ed)
          const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1
          lengthStr = `${diffDays} days`
        }

        return {
          ...item,
          cycleNum: data.length - index,
          // Local YYYY-MM-DD strings (for editing)
          localStartDate: localStart,
          localEndDate: localEnd,
          // Pretty display strings (for table)
          displayStartDate: toDisplayDate(item.start_date),
          displayEndDate: item.end_date ? toDisplayDate(item.end_date) : '-',
          length: lengthStr,
          flow: item.flow || 'Medium'
        }
      })

      setPeriodHistory(processed)

      if (processed.length > 0) {
        const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
        const cycleLen = parseInt(user.cycleLength || 28)
        const periodLen = parseInt(user.periodLength || 5)

        const preds = calculatePredictions(data[0].start_date, cycleLen, periodLen)
        const nextDate = toDisplayDate(preds.nextPeriod[0])

        setStats({
          totalCycles: processed.length,
          avgCycle: cycleLen,
          lastPeriod: processed[0].displayStartDate,
          nextExpected: nextDate
        })
      }
    } catch (err) {
      console.error('Error fetching periods:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (period) => {
    setSelectedPeriod(period)
    setSaveError('')
    // Use the local date strings directly — no re-conversion needed
    setEditFormData({
      startDate: period.localStartDate || '',
      endDate: period.localEndDate || '',
      flow: period.flow || 'Medium'
    })
    setShowEditModal(true)
  }

  const handleDeleteClick = (period) => {
    setSelectedPeriod(period)
    setShowDeleteModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editFormData.startDate) {
      setSaveError('Start date is required.')
      return
    }
    setSaveError('')
    try {
      // Send clean YYYY-MM-DD strings to backend
      await api.updatePeriod(selectedPeriod.id, {
        start_date: editFormData.startDate,
        end_date: editFormData.endDate || null,
        flow: editFormData.flow
      })
      setShowEditModal(false)
      setSelectedPeriod(null)
      fetchPeriods() // Refresh table from DB
    } catch (err) {
      console.error('Error updating period:', err)
      setSaveError('Failed to save. Please try again.')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await api.deletePeriod(selectedPeriod.id)
      setShowDeleteModal(false)
      setSelectedPeriod(null)
      fetchPeriods()
    } catch (err) {
      console.error('Error deleting period:', err)
    }
  }

  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardLayout>
      <div className="history-container">
        {/* Header section */}
        <div className="history-header">
          <div className="history-header-left">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              <ChevronLeft size={20} />
              <div className="title-group">
                <h1>{t('historyTitle')}</h1>
                <p className="history-subtitle">{t('historySubtitle')}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Summary Stats Row */}
        <div className="history-stats-row">
          <Card className="history-stat-card">
            <span className="stat-label">{t('totalCycles')}</span>
            <h2 className="stat-value">{stats.totalCycles}</h2>
          </Card>
          <Card className="history-stat-card">
            <span className="stat-label">{t('avgCycleLengthValue')}</span>
            <h2 className="stat-value">{stats.avgCycle} {t('periodLengthUnit')}</h2>
          </Card>
          <Card className="history-stat-card">
            <span className="stat-label">{t('lastPeriodDateLabel')}</span>
            <h2 className="stat-value text-blue">{stats.lastPeriod}</h2>
          </Card>
          <Card className="history-stat-card">
            <span className="stat-label">{t('nextExpectedLabel')}</span>
            <h2 className="stat-value">{stats.nextExpected}</h2>
          </Card>
        </div>

        {/* Cycle History Table */}
        <Card className="history-table-card">
          {isLoading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>{t('cycleNumLabel')}</th>
                  <th>{t('startDateLabel')}</th>
                  <th>{t('endDateLabel')}</th>
                  <th>{t('cycleTracking')}</th>
                  <th>{t('flowLabel')}</th>
                  <th>{t('actionsLabel')}</th>
                </tr>
              </thead>
              <tbody>
                {periodHistory.map((period) => (
                  <tr key={period.id}>
                    <td>{period.cycleNum}</td>
                    <td>{period.displayStartDate}</td>
                    <td>{period.displayEndDate}</td>
                    <td>{period.length}</td>
                    <td>
                      <span className={`flow-tag flow-${period.flow.toLowerCase()}`}>
                        {period.flow}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="icon-btn edit-btn" title="Edit" onClick={() => handleEditClick(period)}>📝</button>
                      <button className="icon-btn delete-btn" title="Delete" onClick={() => handleDeleteClick(period)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* Cycle Insights Footer Section */}
        <Card className="cycle-insights-footer">
          <div className="insights-header">
            <span className="insights-icon">📈</span>
            <h3>{t('cyclePredictions')}</h3>
          </div>
          <div className="insights-grid">
            <div className="insight-stat">
              <span className="insight-label">{t('regularity')}</span>
              <h4 className="insight-value">{t('veryRegular')}</h4>
              <p className="insight-detail">1 {t('periodLengthUnit')} {t('variation')}</p>
            </div>
            <div className="insight-stat">
              <span className="insight-label">{t('mostCommonFlow')}</span>
              <h4 className="insight-value">{t('medium')}</h4>
              <p className="insight-detail">66% {t('ofCycles')}</p>
            </div>
            <div className="insight-stat">
              <span className="insight-label">{t('predictionAccuracy')}</span>
              <h4 className="insight-value">95%</h4>
              <p className="insight-detail">{t('basedOn')} {stats.totalCycles} {t('ofCycles')}</p>
            </div>
          </div>
        </Card>

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={t('editPeriodRecord')}
          size="medium"
        >
          <div className="modal-form">
            <div className="form-group">
              <label>{t('startDateLabel')}</label>
              <input
                type="date"
                value={editFormData.startDate}
                onChange={(e) => handleEditInputChange('startDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{t('endDateLabel')}</label>
              <input
                type="date"
                value={editFormData.endDate}
                onChange={(e) => handleEditInputChange('endDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{t('flowLabel')}</label>
              <select
                value={editFormData.flow}
                onChange={(e) => handleEditInputChange('flow', e.target.value)}
              >
                <option value="">{t('selectActivity')}</option>
                <option value="Light">{t('light')}</option>
                <option value="Medium">{t('medium')}</option>
                <option value="Heavy">{t('heavy')}</option>
              </select>
            </div>
            {saveError && <p style={{ color: 'red', fontSize: '13px' }}>{saveError}</p>}
            <div className="modal-buttons">
              <button className="btn-save" onClick={handleSaveEdit}>{t('saveChanges')}</button>
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>{t('cancel')}</button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title={t('deletePeriodRecord')}
          size="small"
        >
          <div className="delete-confirmation">
            <p>{t('confirmDeletePeriod')}</p>
            {selectedPeriod && (
              <p className="period-info">
                <strong>Cycle #{selectedPeriod.cycleNum}</strong> • {selectedPeriod.displayStartDate} to {selectedPeriod.displayEndDate}
              </p>
            )}
            <p className="warning-text">{t('cannotBeUndone')}</p>
            <div className="modal-buttons">
              <button className="btn-delete" onClick={handleConfirmDelete}>{t('delete')}</button>
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>{t('cancel')}</button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
