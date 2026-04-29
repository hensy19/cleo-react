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

export default function History() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [periodHistory, setPeriodHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)

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
      
      // Process data: add cycle numbers and calculate length
      const processed = data.map((item, index) => {
        const start = new Date(item.start_date)
        const end = item.end_date ? new Date(item.end_date) : null
        
        let lengthStr = '-'
        if (end) {
          const diffTime = Math.abs(end - start)
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
          lengthStr = `${diffDays} days`
        }

        return {
          ...item,
          cycleNum: data.length - index,
          startDate: new Date(item.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          endDate: item.end_date ? new Date(item.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-',
          length: lengthStr,
          flow: item.flow || 'Medium'
        }
      })

      setPeriodHistory(processed)

      // Calculate stats
      if (processed.length > 0) {
        const last = processed[0]
        
        // Use user's cycle settings for predictions
        const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
        const cycleLen = parseInt(user.cycleLength || 28)
        const periodLen = parseInt(user.periodLength || 5)
        
        const preds = calculatePredictions(data[0].start_date, cycleLen, periodLen)
        const nextDate = new Date(preds.nextPeriod[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

        setStats({
          totalCycles: processed.length,
          avgCycle: cycleLen,
          lastPeriod: last.startDate,
          nextExpected: nextDate
        })
      }
    } catch (err) {
      console.error("Error fetching periods:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (period) => {
    setSelectedPeriod(period)
    // Convert display date back to YYYY-MM-DD for input
    const toISO = (dateStr) => {
      if (!dateStr || dateStr === '-') return ''
      return new Date(dateStr).toISOString().split('T')[0]
    }
    
    setEditFormData({
      startDate: toISO(period.startDate),
      endDate: toISO(period.endDate),
      flow: period.flow
    })
    setShowEditModal(true)
  }

  const handleDeleteClick = (period) => {
    setSelectedPeriod(period)
    setShowDeleteModal(true)
  }

  const handleSaveEdit = async () => {
    try {
      await api.updatePeriod(selectedPeriod.id, {
        start_date: editFormData.startDate,
        end_date: editFormData.endDate,
        flow: editFormData.flow
      })
      setShowEditModal(false)
      setSelectedPeriod(null)
      fetchPeriods()
    } catch (err) {
      console.error("Error updating period:", err)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await api.deletePeriod(selectedPeriod.id)
      setShowDeleteModal(false)
      setSelectedPeriod(null)
      fetchPeriods()
    } catch (err) {
      console.error("Error deleting period:", err)
    }
  }

  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
                    <td>{period.startDate}</td>
                    <td>{period.endDate}</td>
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
              <label>Cycle Length</label>
              <input
                type="text"
                value={editFormData.length}
                onChange={(e) => handleEditInputChange('length', e.target.value)}
                placeholder="e.g., 28 days"
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
                <strong>Cycle #{selectedPeriod.cycleNum}</strong> • {selectedPeriod.startDate} to {selectedPeriod.endDate}
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
