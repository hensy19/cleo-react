import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { useNotifications } from '../../context/NotificationContext'
import { useSettings } from '../../context/SettingsContext'
import { api } from '../../utils/api'
import './AdminSettings.css'
import logoImg from '../../assets/images/logo.png'

export default function AdminSettingsGeneral() {
  const navigate = useNavigate()
  const { showToast } = useNotifications()
  const { logoUrl, setLogoUrl, setSiteName: setGlobalSiteName } = useSettings()

  const [siteName, setSiteName] = useState('')
  const [supportEmail, setSupportEmail] = useState('')
  const [contactNo, setContactNo] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [logoPreview, setLogoPreview] = useState(logoImg)
  const fileInputRef = useRef(null)

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
      setSiteName(data.siteName || 'Cleo')
      setSupportEmail(data.supportEmail || 'support@cleo.com')
      setContactNo(data.contactNo || '+0123456789')
      // Add cache-buster so browser always fetches fresh logo
      if (data.logoUrl) {
        const freshUrl = `${data.logoUrl}?t=${Date.now()}`
        setLogoPreview(freshUrl)
      }
    } catch (err) {
      console.error('Failed to fetch settings', err)
      showToast('Could not load settings from database')
    } finally {
      setIsLoading(false)
    }
  }

  // When admin picks a file, upload it immediately to the backend
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Show instant local preview (object URL — always fresh, no caching)
    const localPreview = URL.createObjectURL(file)
    setLogoPreview(localPreview)

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('logo', file)

      const result = await api.uploadAdminLogo(formData)

      // Add cache-busting timestamp so the global context URL forces a fresh fetch
      const cacheBustedUrl = `${result.logoUrl}?t=${Date.now()}`
      setLogoUrl(cacheBustedUrl)   // Updates Navbar/Footer/AdminLayout globally
      // Keep localPreview in the box — it's already showing the correct new image
      showToast('Logo updated successfully! ✓')
    } catch (err) {
      console.error('Logo upload failed', err)
      showToast('Failed to upload logo: ' + err.message)
      // Revert preview on failure
      setLogoPreview(logoUrl)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setIsSaving(true)
      await api.updateAdminSettings({ siteName, supportEmail, contactNo })
      setGlobalSiteName(siteName) // Instantly updates browser tab title
      showToast('General settings saved successfully! ✓')
    } catch (err) {
      console.error('Failed to save settings', err)
      showToast('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminLayout activePage="settings-general">

      <div className="as-system-card">
        <h1>System Settings</h1>
        <p>Manage your platform configuration</p>
      </div>

      <div className="as-content-card">
        <h2>General settings</h2>

        {isLoading ? (
          <p style={{ padding: '1rem', color: '#A0AEC0' }}>Loading settings...</p>
        ) : (
          <form className="as-form" onSubmit={handleSave}>
            <div className="as-input-group">
              <label>Site Name</label>
              <input
                type="text"
                value={siteName}
                onChange={e => setSiteName(e.target.value)}
              />
            </div>

            {/* Logo Upload Section */}
            <div className="as-logo-container">
              <div className="as-logo-box">
                {isUploading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div className="as-logo-spinner" />
                    <span style={{ fontSize: '12px', color: '#ffffffff' }}>Uploading...</span>
                  </div>
                ) : logoPreview ? (
                  <img src={logoPreview} alt="Site Logo" />
                ) : (
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
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                {isUploading ? 'Uploading...' : 'Change Logo'}
              </button>
              <p style={{ fontSize: '11px', color: '#718096', margin: '4px 0 0 0' }}>
                Max 2MB · PNG, JPG, SVG
              </p>
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
