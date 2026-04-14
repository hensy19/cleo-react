import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import { useLanguage } from '../../context/LanguageContext'
import './History.css'

export default function History() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [periodHistory, setPeriodHistory] = useState([
    { id: 1, cycleNum: 6, startDate: 'Jan 31, 2026', endDate: 'Feb 5, 2026', length: '28 days', flow: 'Medium' },
    { id: 2, cycleNum: 5, startDate: 'Jan 3, 2026', endDate: 'Jan 8, 2026', length: '29 days', flow: 'Heavy' },
    { id: 3, cycleNum: 4, startDate: 'Dec 5, 2025', endDate: 'Dec 10, 2025', length: '28 days', flow: 'Light' },
    { id: 4, cycleNum: 3, startDate: 'Nov 7, 2025', endDate: 'Nov 12, 2025', length: '28 days', flow: 'Medium' },
    { id: 5, cycleNum: 2, startDate: 'Oct 10, 2025', endDate: 'Oct 15, 2025', length: '27 days', flow: 'Medium' },
    { id: 6, cycleNum: 1, startDate: 'Sep 13, 2025', endDate: 'Sep 18, 2025', length: '28 days', flow: 'Heavy' }
  ])

  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [editFormData, setEditFormData] = useState({
    startDate: '',
    endDate: '',
    length: '',
    flow: ''
  })

  const handleEditClick = (period) => {
    setSelectedPeriod(period)
    setEditFormData({
      startDate: period.startDate,
      endDate: period.endDate,
      length: period.length,
      flow: period.flow
    })
    setShowEditModal(true)
  }

  const handleDeleteClick = (period) => {
    setSelectedPeriod(period)
    setShowDeleteModal(true)
  }

  const handleSaveEdit = () => {
    setPeriodHistory(periodHistory.map(period =>
      period.id === selectedPeriod.id
        ? {
            ...period,
            startDate: editFormData.startDate,
            endDate: editFormData.endDate,
            length: editFormData.length,
            flow: editFormData.flow
          }
        : period
    ))
    setShowEditModal(false)
    setSelectedPeriod(null)
  }

  const handleConfirmDelete = () => {
    setPeriodHistory(periodHistory.filter(period => period.id !== selectedPeriod.id))
    setShowDeleteModal(false)
    setSelectedPeriod(null)
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
            <h2 className="stat-value">6</h2>
          </Card>
          <Card className="history-stat-card">
            <span className="stat-label">{t('avgCycleLengthValue')}</span>
            <h2 className="stat-value">28 {t('periodLengthUnit')}</h2>
          </Card>
          <Card className="history-stat-card">
            <span className="stat-label">{t('lastPeriodDateLabel')}</span>
            <h2 className="stat-value text-blue">Jan 31, 2026</h2>
          </Card>
          <Card className="history-stat-card">
            <span className="stat-label">{t('nextExpectedLabel')}</span>
            <h2 className="stat-value">Feb 28, 2026</h2>
          </Card>
        </div>

        {/* Cycle History Table */}
        <Card className="history-table-card">
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
              <p className="insight-detail">{t('basedOn')} 6 {t('ofCycles')}</p>
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
                type="text"
                value={editFormData.startDate}
                onChange={(e) => handleEditInputChange('startDate', e.target.value)}
                placeholder="e.g., Jan 31, 2026"
              />
            </div>
            <div className="form-group">
              <label>{t('endDateLabel')}</label>
              <input
                type="text"
                value={editFormData.endDate}
                onChange={(e) => handleEditInputChange('endDate', e.target.value)}
                placeholder="e.g., Feb 5, 2026"
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
