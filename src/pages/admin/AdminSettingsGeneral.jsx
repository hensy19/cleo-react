import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { useNotifications } from '../../context/NotificationContext'
import './AdminSettings.css'
import logoImg from '../../assets/images/logo.png'

export default function AdminSettingsGeneral() {
  const navigate = useNavigate()
  const { showToast } = useNotifications()

  // Local state for the general settings inputs
  const [siteName, setSiteName] = useState('Cleo')
  const [supportEmail, setSupportEmail] = useState('support@cleo.com')
  const [contactNo, setContactNo] = useState('+0123456789')

  // Handles the actual custom image uploading logic securely in React!
  const [logoPreview, setLogoPreview] = useState(logoImg)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      navigate('/admin/login')
    }
  }, [navigate])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Create local temporary URL representing the image file chosen 
      const newUrl = URL.createObjectURL(file)
      setLogoPreview(newUrl)
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    showToast('General settings saved successfully!')
  }

  return (
    <AdminLayout activePage="settings-general">


      <div className="as-system-card">
        <h1>System Settings</h1>
        <p>Manage your platform configuration</p>
      </div>

      <div className="as-content-card">
        <h2>General settings</h2>

        <form className="as-form" onSubmit={handleSave}>
          <div className="as-input-group">
            <label>Site Name</label>
            <input
              type="text"
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
            />
          </div>

          <div className="as-logo-container">
            <div className="as-logo-box">
              {logoPreview ? (
                <img src={logoPreview} alt="Site Logo" />
              ) : (
                /* Native fallback text matching cleo logo */
                <h1 style={{ margin: 0, color: '#10517F', fontSize: '2rem', fontWeight: 800 }}>cleo</h1>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImageChange}
            />

            <button
              type="button"
              className="as-btn-change"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Change
            </button>
          </div>

          <div className="as-input-group">
            <label>Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={e => setSupportEmail(e.target.value)}
            />
          </div>

          <div className="as-input-group">
            <label>Contact no</label>
            <input
              type="tel"
              value={contactNo}
              onChange={e => setContactNo(e.target.value)}
            />
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
