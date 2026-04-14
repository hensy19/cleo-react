import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Lock,
  CheckCircle,
  Edit3,
  LogOut,
  Camera,
  X
} from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import { useNotifications } from '../../context/NotificationContext'
import './AdminProfile.css'

export default function AdminProfile() {
  const navigate = useNavigate()
  const { showToast } = useNotifications()

  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showPassModal, setShowPassModal] = useState(false)
  const [passForm, setPassForm] = useState({ current: '', next: '', confirm: '' })
  const [passSaved, setPassSaved] = useState(false)

  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem('adminInfo')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return {
          firstName: parsed.firstName || parsed.name?.split(' ')[0] || 'Hensy',
          lastName: parsed.lastName || parsed.name?.split(' ')[1] || 'Patel',
          role: parsed.role || 'Admin',
          email: parsed.email || 'abc@gmail.com',
          phone: parsed.phone || '+91 0123456789',
          dob: parsed.dob || '01/01/2005',
        }
      } catch { /* ignore */ }
    }
    return {
      firstName: 'Hensy',
      lastName: 'Patel',
      role: 'Admin',
      email: 'abc@gmail.com',
      phone: '+91 0123456789',
      dob: '01/01/2005',
    }
  })

  const [editProfile, setEditProfile] = useState({ ...profile })

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      navigate('/admin/login')
    }
  }, [navigate])

  const handleEdit = () => {
    setEditProfile({ ...profile })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    setProfile({ ...editProfile })
    localStorage.setItem('adminInfo', JSON.stringify({
      ...editProfile,
      name: `${editProfile.firstName} ${editProfile.lastName}`
    }))
    setIsEditing(false)
    showToast('Profile updated successfully!')
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminInfo')
    navigate('/admin/login')
  }

  const handlePassChange = (e) => {
    e.preventDefault()
    if (passForm.next !== passForm.confirm) {
      showToast("Passwords do not match!", 'error')
      return
    }
    // Simulate API call
    setPassSaved(true)
    setTimeout(() => {
      setPassSaved(false)
      setShowPassModal(false)
      setPassForm({ current: '', next: '', confirm: '' })
      showToast('Password updated successfully!')
    }, 2000)
  }

  return (
    <AdminLayout activePage="profile">
      <div className="ap-wrapper">
        {/* Page Title */}
        <div className="ap-title-section">
          <h1 className="ap-title">Administrator Profile</h1>
          <p className="ap-subtitle">Manage your account settings and personal information</p>
        </div>

        <div className="ap-content-grid">
          {/* Left Column: Avatar & Summary */}
          <div className="ap-left-col">
            <div className="ap-profile-aside">
              <div className="ap-banner-card">
                <div className="ap-cover-gradient"></div>
                <div className="ap-banner-main">
                  <div className="ap-avatar-container">
                    <div className="ap-avatar-wrap">
                      <User size={40} color="var(--primary-color)" />
                    </div>
                    {isEditing && (
                      <button className="ap-change-avatar" title="Change Photo">
                        <Camera size={16} />
                      </button>
                    )}
                  </div>
                  <div className="ap-banner-info">
                    <div className="ap-banner-name">{profile.firstName} {profile.lastName}</div>
                    <div className="ap-banner-role">System Administrator</div>
                    <div className="ap-status-badge">
                      <span className="status-dot"></span> Active
                    </div>
                  </div>
                </div>

                <div className="ap-banner-footer">
                  <div className="ap-stat">
                    <span className="ap-stat-label">Joined</span>
                    <span className="ap-stat-val">Jan 2026</span>
                  </div>
                </div>
              </div>

              <button className="ap-logout-btn" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Sign Out of Account</span>
              </button>
            </div>
          </div>

          {/* Right Column: Form Modules */}
          <div className="ap-right-col">
            {/* Personal Information Card */}
            <div className="ap-module-card">
              <div className="ap-module-header">
                <div className="ap-header-left">
                  <User size={20} />
                  <h2 className="ap-module-title">Personal Information</h2>
                </div>
                {!isEditing && (
                  <button className="ap-edit-trigger" onClick={handleEdit}>
                    <Edit3 size={16} />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleSave} className="ap-form">
                <div className="ap-form-grid">
                  <div className="ap-field">
                    <label><User size={14} /> First Name</label>
                    <input
                      type="text"
                      value={isEditing ? editProfile.firstName : profile.firstName}
                      onChange={e => setEditProfile({ ...editProfile, firstName: e.target.value })}
                      readOnly={!isEditing}
                      className={!isEditing ? 'ap-input-readonly' : 'ap-input-active'}
                    />
                  </div>
                  <div className="ap-field">
                    <label><User size={14} /> Last Name</label>
                    <input
                      type="text"
                      value={isEditing ? editProfile.lastName : profile.lastName}
                      onChange={e => setEditProfile({ ...editProfile, lastName: e.target.value })}
                      readOnly={!isEditing}
                      className={!isEditing ? 'ap-input-readonly' : 'ap-input-active'}
                    />
                  </div>
                  <div className="ap-field">
                    <label><Calendar size={14} /> Date of Birth</label>
                    <input
                      type="text"
                      value={isEditing ? editProfile.dob : profile.dob}
                      onChange={e => setEditProfile({ ...editProfile, dob: e.target.value })}
                      placeholder="DD/MM/YYYY"
                      readOnly={!isEditing}
                      className={!isEditing ? 'ap-input-readonly' : 'ap-input-active'}
                    />
                  </div>
                  <div className="ap-field full-width">
                    <label><Mail size={14} /> Email Address</label>
                    <input
                      type="email"
                      value={isEditing ? editProfile.email : profile.email}
                      onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
                      readOnly={!isEditing}
                      className={!isEditing ? 'ap-input-readonly' : 'ap-input-active'}
                    />
                  </div>
                  <div className="ap-field full-width">
                    <label><Phone size={14} /> Phone Number</label>
                    <input
                      type="tel"
                      value={isEditing ? editProfile.phone : profile.phone}
                      onChange={e => setEditProfile({ ...editProfile, phone: e.target.value })}
                      readOnly={!isEditing}
                      className={!isEditing ? 'ap-input-readonly' : 'ap-input-active'}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="ap-form-actions">
                    <button type="button" className="ap-cancel-button" onClick={handleCancel}>Discard</button>
                    <button type="submit" className="ap-save-button">Update Profile</button>
                  </div>
                )}
              </form>
            </div>

            {/* Security Section (Placeholder) */}
            <div className="ap-module-card ap-security-module">
              <div className="ap-module-header">
                <div className="ap-header-left">
                  <Shield size={20} />
                  <h2 className="ap-module-title">Security & Password</h2>
                </div>
              </div>
              <div className="ap-security-content">
                <div className="ap-security-info">
                  <div className="ap-security-item">
                    <Lock size={16} />
                    <div className="ap-item-text">
                      <div className="ap-item-label">Password</div>
                      <div className="ap-item-sub">Last changed 3 months ago</div>
                    </div>
                    <button
                      className="ap-security-action"
                      onClick={() => setShowPassModal(true)}
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Change Password Modal */}
        {showPassModal && (
          <div className="ap-modal-overlay">
            <div className="ap-modal">
              <div className="ap-modal-header">
                <h3>Change Password</h3>
                <button
                  className="ap-modal-close"
                  onClick={() => setShowPassModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handlePassChange} className="ap-modal-form">
                <div className="ap-field">
                  <label>Current Password</label>
                  <input
                    type="password"
                    required
                    value={passForm.current}
                    onChange={e => setPassForm({ ...passForm, current: e.target.value })}
                  />
                </div>
                <div className="ap-field">
                  <label>New Password</label>
                  <input
                    type="password"
                    required
                    value={passForm.next}
                    onChange={e => setPassForm({ ...passForm, next: e.target.value })}
                  />
                </div>
                <div className="ap-field">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passForm.confirm}
                    onChange={e => setPassForm({ ...passForm, confirm: e.target.value })}
                  />
                </div>
                <button type="submit" className="ap-modal-save" disabled={passSaved}>
                  {passSaved ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
