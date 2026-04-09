import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import './AdminSettings.css'

export default function AdminSettingsData() {
  const navigate = useNavigate()

  const [autoBackup, setAutoBackup] = useState(false)
  const [restrictAccess, setRestrictAccess] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      navigate('/admin/login')
    }
  }, [navigate])

  const handleExport = () => {
    setExporting(true)
    // Simulate generating and downloading a CSV
    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8,Name,Email,Joined\nHensy Patel,hensy@cleo.com,Jan 2026\nRidhdhi Raval,ridhdhi@cleo.com,Jan 2026\nKomal Mishra,komal@cleo.com,Feb 2026\n"
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", "cleo_users_export.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setExporting(false)
    }, 1000)
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AdminLayout activePage="settings-data">
      <div className="as-system-card">
        <h1>System Settings</h1>
        <p>Manage your platform configuration</p>
      </div>

      <div className="as-content-card">
        <h2>Data management</h2>

        <form className="as-form" onSubmit={handleSave}>

          

          <div className="as-toggle-row as-clickable-row" onClick={handleExport} style={{ cursor: 'pointer' }}>
            <div className="as-toggle-info">
              <span className="as-toggle-title">{exporting ? 'Exporting...' : 'Export User Data'}</span>
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

          <button type="submit" className={`as-btn-save ${saved ? 'as-btn-saved' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            {saved ? 'Saved!' : 'save changes'}
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}
