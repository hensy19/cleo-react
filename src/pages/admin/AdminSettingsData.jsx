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

export default function AdminSettingsData() {
  const navigate = useNavigate()
  const { showToast } = useNotifications()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [exporting, setExporting] = useState(false)

  const [autoBackup, setAutoBackup] = useState(false)
  const [restrictAccess, setRestrictAccess] = useState(false)

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
      setAutoBackup(toBool(data.autoBackup, false))
      setRestrictAccess(toBool(data.restrictAccess, false))
    } catch (err) {
      console.error('Failed to fetch data settings', err)
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
        autoBackup: String(autoBackup),
        restrictAccess: String(restrictAccess),
      })
      showToast('Data management settings saved successfully! ✓')
    } catch (err) {
      console.error('Failed to save data settings', err)
      showToast('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  // Export real users from the DB via the admin API
  const handleExport = async () => {
    try {
      setExporting(true)
      const users = await api.getAdminUsers()

      // Build CSV from live data
      const headers = ['Name', 'Email', 'Joined']
      const rows = users.map(u => [
        u.name,
        u.email,
        new Date(u.created_at).toLocaleDateString('en-IN'),
      ])
      const csvContent = [headers, ...rows]
        .map(r => r.map(v => `"${v}"`).join(','))
        .join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `cleo_users_${Date.now()}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      showToast(`Exported ${users.length} users successfully! ✓`)
    } catch (err) {
      console.error('Export failed', err)
      showToast('Failed to export user data')
    } finally {
      setExporting(false)
    }
  }

  return (
    <AdminLayout activePage="settings-data">
      <div className="as-system-card">
        <h1>System Settings</h1>
        <p>Manage your platform configuration</p>
      </div>

      <div className="as-content-card">
        <h2>Data management</h2>

        {isLoading ? (
          <p style={{ padding: '1rem', color: '#A0AEC0' }}>Loading settings...</p>
        ) : (
          <form className="as-form" onSubmit={handleSave}>

            {/* Export — live data from DB */}
            <div
              className="as-toggle-row as-clickable-row"
              onClick={!exporting ? handleExport : undefined}
              style={{ cursor: exporting ? 'wait' : 'pointer' }}
            >
              <div className="as-toggle-info">
                <span className="as-toggle-title">
                  {exporting ? 'Exporting...' : 'Export User Data'}
                </span>
                <span className="as-toggle-subtitle">Download all users as CSV</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <polyline points="9 15 12 18 15 15"></polyline>
              </svg>
            </div>

            <div className="as-toggle-row">
              <div className="as-toggle-info">
                <span className="as-toggle-title">Restrict Admin Access to Sensitive Data</span>
                <span className="as-toggle-subtitle">Limit visibility of private user information</span>
              </div>
              <label className="as-switch">
                <input
                  type="checkbox"
                  checked={restrictAccess}
                  onChange={e => setRestrictAccess(e.target.checked)}
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
