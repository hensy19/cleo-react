import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import './AdminSettings.css'

export default function AdminSettingsPrivacy() {
  const navigate = useNavigate()

  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [allowRegistration, setAllowRegistration] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(true)
  const [sessionDuration, setSessionDuration] = useState('20 minutes')

  const [reqLength, setReqLength] = useState(true)
  const [reqUppercase, setReqUppercase] = useState(true)

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      navigate('/admin/login')
    }
  }, [navigate])

  const handleSave = (e) => {
    e.preventDefault()
    alert('Privacy & Security settings saved successfully!')
  }

  return (
    <AdminLayout activePage="settings-privacy">

      <div className="as-system-card">
        <h1>System Settings</h1>
        <p>Manage your platform configuration</p>
      </div>

      <div className="as-content-card">
        <h2>Privacy and security</h2>

        <form className="as-form" onSubmit={handleSave}>



          <div className="as-toggle-row">
            <div className="as-toggle-info">
              <span className="as-toggle-title">Allow New Registrations</span>
              <span className="as-toggle-subtitle">Enable user sign-ups</span>
            </div>
            <label className="as-switch">
              <input
                type="checkbox"
                checked={allowRegistration}
                onChange={(e) => setAllowRegistration(e.target.checked)}
              />
              <span className="as-slider"></span>
            </label>
          </div>

          <div className="as-toggle-row">
            <div className="as-toggle-info">
              <span className="as-toggle-title">Session Timeout</span>
              <span className="as-toggle-subtitle">Auto logout after inactivity</span>
            </div>
            <label className="as-switch">
              <input
                type="checkbox"
                checked={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.checked)}
              />
              <span className="as-slider"></span>
            </label>
          </div>

          {sessionTimeout && (
            <div className="as-input-group">
              <label>Session duration</label>
              <select value={sessionDuration} onChange={(e) => setSessionDuration(e.target.value)}>
                <option value="10 minutes">10 minutes</option>
                <option value="20 minutes">20 minutes</option>
                <option value="30 minutes">30 minutes</option>
                <option value="1 hour">1 hour</option>
              </select>
            </div>
          )}

          <div className="as-input-group">
            <label>Password requirements</label>
            <div className="as-checkbox-group">
              <label className="as-checkbox-lbl">
                <input
                  type="checkbox"
                  checked={reqLength}
                  onChange={(e) => setReqLength(e.target.checked)}
                />
                Minimum 8 characters
              </label>
              <label className="as-checkbox-lbl">
                <input
                  type="checkbox"
                  checked={reqUppercase}
                  onChange={(e) => setReqUppercase(e.target.checked)}
                />
                At least one uppercase letter
              </label>
            </div>
          </div>

          <button type="submit" className="as-btn-save">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            save changes
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}
