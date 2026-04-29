import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { useNotifications } from '../../context/NotificationContext'
import { api } from '../../utils/api'
import './AdminSettings.css'

const toBool = (val, fallback = false) => {
  if (val === null || val === undefined) return fallback
  if (typeof val === 'boolean') return val
  return val === 'true'
}

export default function AdminSettingsContent() {
  const navigate = useNavigate()
  const { showToast } = useNotifications()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [defaultCycleLength, setDefaultCycleLength] = useState('28')
  const [enableOvulationDisplay, setEnableOvulationDisplay] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [showCycleSummary, setShowCycleSummary] = useState(false)

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      navigate('/admin/login')
      return
    }
    fetchSettings()
  }, [navigate])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const data = await api.getAdminSettings()
      setDefaultCycleLength(data.defaultCycleLength || '28')
      setEnableOvulationDisplay(toBool(data.enableOvulationDisplay, false))
      setShowTips(toBool(data.showTips, false))
      setShowCycleSummary(toBool(data.showCycleSummary, false))
    } catch (err) {
      console.error('Failed to fetch content settings', err)
      showToast('Could not load settings from database')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setIsSaving(true)
      await api.updateAdminSettings({
        defaultCycleLength,
        enableOvulationDisplay: String(enableOvulationDisplay),
        showTips: String(showTips),
        showCycleSummary: String(showCycleSummary),
      })
      showToast('Content controls saved successfully! ✓')
    } catch (err) {
      console.error('Failed to save content settings', err)
      showToast('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminLayout activePage="settings-content">
      <div className="as-system-card">
        <h1>System Settings</h1>
        <p>Manage your platform configuration</p>
      </div>

      <div className="as-content-card">
        <h2>Content management control</h2>

        {isLoading ? (
          <p style={{ padding: '1rem', color: '#A0AEC0' }}>Loading settings...</p>
        ) : (
          <form className="as-form" onSubmit={handleSave}>

            <div className="as-input-group">
              <label>Default Cycle Length (days)</label>
              <input
                type="number"
                min="21"
                max="45"
                value={defaultCycleLength}
                onChange={e => setDefaultCycleLength(e.target.value)}
              />
            </div>

            <div className="as-toggle-row">
              <div className="as-toggle-info">
                <span className="as-toggle-title">Enable Ovulation Display</span>
                <span className="as-toggle-subtitle">Show ovulation window on user calendars</span>
              </div>
              <label className="as-switch">
                <input
                  type="checkbox"
                  checked={enableOvulationDisplay}
                  onChange={e => setEnableOvulationDisplay(e.target.checked)}
                />
                <span className="as-slider"></span>
              </label>
            </div>

            <div className="as-toggle-row">
              <div className="as-toggle-info">
                <span className="as-toggle-title">Show Tip on Dashboard</span>
                <span className="as-toggle-subtitle">Display daily health tips to users</span>
              </div>
              <label className="as-switch">
                <input
                  type="checkbox"
                  checked={showTips}
                  onChange={e => setShowTips(e.target.checked)}
                />
                <span className="as-slider"></span>
              </label>
            </div>

            <div className="as-toggle-row">
              <div className="as-toggle-info">
                <span className="as-toggle-title">Show Cycle Summary Card</span>
                <span className="as-toggle-subtitle">Display cycle overview on user dashboard</span>
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

            <button type="submit" className="as-btn-save" disabled={isSaving}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>

          </form>
        )}
      </div>
    </AdminLayout>
  )
}
