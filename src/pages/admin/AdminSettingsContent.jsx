import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { useNotifications } from '../../context/NotificationContext'
import './AdminSettings.css'

export default function AdminSettingsContent() {
  const navigate = useNavigate()
  const { showToast } = useNotifications()

  const [defaultCycleLength, setDefaultCycleLength] = useState('28 days')
  const [enableOvulation, setEnableOvulation] = useState(false)
  const [showTipOnDashboard, setShowTipOnDashboard] = useState(false)
  const [showCycleSummary, setShowCycleSummary] = useState(false)

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      navigate('/admin/login')
    }
  }, [navigate])

  const handleSave = (e) => {
    e.preventDefault()
    showToast('Content controls saved successfully!')
  }

  return (
    <AdminLayout activePage="settings-content">
      <div className="as-system-card">
        <h1>System Settings</h1>
        <p>Manage your platform configuration</p>
      </div>

      <div className="as-content-card">
        <h2>Content management control</h2>

        <form className="as-form" onSubmit={handleSave}>
          <div className="as-input-group">
            <label>Default Cycle Length</label>
            <input
              type="text"
              value={defaultCycleLength}
              onChange={e => setDefaultCycleLength(e.target.value)}
            />
          </div>

          <div className="as-toggle-row">
            <div className="as-toggle-info">
              <span className="as-toggle-title">Enable Ovulation Display</span>
            </div>
            <label className="as-switch">
              <input
                type="checkbox"
                checked={enableOvulation}
                onChange={e => setEnableOvulation(e.target.checked)}
              />
              <span className="as-slider"></span>
            </label>
          </div>

          <div className="as-toggle-row">
            <div className="as-toggle-info">
              <span className="as-toggle-title">Show Tip on Dashboard</span>
            </div>
            <label className="as-switch">
              <input
                type="checkbox"
                checked={showTipOnDashboard}
                onChange={e => setShowTipOnDashboard(e.target.checked)}
              />
              <span className="as-slider"></span>
            </label>
          </div>

          <div className="as-toggle-row">
            <div className="as-toggle-info">
              <span className="as-toggle-title">Show Cycle Summary Card</span>
            </div>
            <label className="as-switch">
              <input
                type="checkbox"
                checked={showCycleSummary}
                onChange={e => setShowCycleSummary(e.target.checked)}
              />
              <span className="as-slider"></span>
            </label>
          </div>

          <button type="submit" className="as-btn-save">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            save changes
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}
