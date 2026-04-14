import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { useNotifications } from '../../context/NotificationContext'
import './AdminRoles.css'

const MOCK_ADMINS = [
  { id: 1, name: "Diya", joined: "Jan 2026", lastActive: "3 mins ago", status: "active", email: "diya@cleo.com", role: "Super Admin" },
  { id: 2, name: "Hensy", joined: "Jan 2026", lastActive: "2 hrs ago", status: "active", email: "hensy@cleo.com", role: "Super Admin" }
]

export default function AdminRoles() {
  const navigate = useNavigate()
  const { showModal, showToast } = useNotifications()
  
  const [admins, setAdmins] = useState(MOCK_ADMINS)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('view') // 'add' | 'edit'
  const [currentAdmin, setCurrentAdmin] = useState(null)

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      navigate('/admin/login')
    }
  }, [navigate])

  const filteredAdmins = admins.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBlockToggle = (id) => {
    const admin = admins.find(a => a.id === id)
    const action = admin.status === 'active' ? 'deactivate' : 'activate'
    
    showModal({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Admin`,
      message: `Are you sure you want to ${action} this admin account?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      onConfirm: () => {
        setAdmins(admins.map(a => {
          if (a.id === id) {
            return { ...a, status: a.status === 'active' ? 'inactive' : 'active' }
          }
          return a
        }))
        showToast(`Admin ${action}d successfully!`)
      }
    })
  }

  const handleDelete = (id) => {
    showModal({
      title: 'Delete Admin',
      message: 'Are you sure you want to permanently delete this admin? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: () => {
        setAdmins(admins.filter(a => a.id !== id))
        showToast('Admin deleted successfully!')
      }
    })
  }

  const openModal = (admin, mode) => {
    setCurrentAdmin(admin ? { ...admin } : { name: '', email: '', role: 'Admin', status: 'active', joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), lastActive: 'Just now' })
    setModalMode(mode)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentAdmin(null)
  }

  const handleModalSave = (e) => {
    e.preventDefault()
    if (modalMode === 'edit') {
      setAdmins(admins.map(a => a.id === currentAdmin.id ? currentAdmin : a))
      showToast('Admin updated successfully!')
    } else if (modalMode === 'add') {
      const newAdmin = { ...currentAdmin, id: Date.now() }
      setAdmins([...admins, newAdmin])
      showToast('Admin created successfully!')
    }
    closeModal()
  }

  return (
    <AdminLayout activePage="roles" onSearch={setSearchTerm}>
      {/* Header section */}
      <div className="ar-header-container">
        <div>
          <h1 className="ar-title">Admins</h1>
          <p className="ar-subtitle">Manage admin users and permissions</p>
        </div>
        <button className="ar-btn-new" onClick={() => openModal(null, 'add')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          Add Admin
        </button>
      </div>

      {/* Stats Cards */}
      <div className="ar-stats-row">
        <div className="ar-stat-card">
          <svg className="ar-stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <div className="ar-stat-num">{admins.length}</div>
          <div className="ar-stat-lbl">Total Admins</div>
        </div>
        <div className="ar-stat-card">
          <svg className="ar-stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
          <div className="ar-stat-num">{admins.filter(a => a.role === 'Super Admin').length}</div>
          <div className="ar-stat-lbl">Super Admins</div>
        </div>
        <div className="ar-stat-card">
          <svg className="ar-stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
          <div className="ar-stat-num">{admins.filter(a => a.status === 'active').length}</div>
          <div className="ar-stat-lbl">Active Admins</div>
        </div>
        <div className="ar-stat-card">
          <svg className="ar-stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><circle cx="20" cy="11" r="3"></circle><line x1="20" y1="8" x2="20" y2="11"></line></svg>
          <div className="ar-stat-num">{admins.filter(a => a.status !== 'active').length}</div>
          <div className="ar-stat-lbl">Inactive Admins</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="ar-table-card">
        <div className="ar-table-header">
          <h2>Admin users</h2>
          <p>Manage admin team members</p>
        </div>
        
        <div className="ar-table-wrapper">
          <table className="ar-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Joined</th>
                <th>Last active</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map(admin => (
                  <tr key={admin.id}>
                    <td className="ar-td-name">{admin.name}</td>
                    <td className="ar-td-base">{admin.joined}</td>
                    <td className="ar-td-base">{admin.lastActive}</td>
                    <td>
                      <span className={`ar-status-pill ${admin.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                        {admin.status}
                      </span>
                    </td>
                    <td>
                      <div className="ar-actions">
                        <button className="ar-action-icon block" onClick={() => handleBlockToggle(admin.id)} title={admin.status === 'active' ? "Deactivate" : "Activate"}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M7 17L17 7" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </button>
                        <button className="ar-action-icon edit" onClick={() => openModal(admin, 'edit')} title="Edit Admin">
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button className="ar-action-icon del" onClick={() => handleDelete(admin.id)} title="Delete Admin">
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="ar-no-results">No admins match your search terms.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Modal */}
      {isModalOpen && currentAdmin && (
        <div className="ar-modal-overlay" onClick={closeModal}>
          <div className="ar-modal-content" onClick={e => e.stopPropagation()}>
            <div className="ar-modal-header">
              <h2>{modalMode === 'edit' ? 'Edit Admin' : 'Add New Admin'}</h2>
              <button className="ar-modal-close" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={handleModalSave}>
              <div className="ar-modal-body">
                <div className="ar-form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={currentAdmin.name} 
                    onChange={e => setCurrentAdmin({...currentAdmin, name: e.target.value})}
                    required
                  />
                </div>

                <div className="ar-form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={currentAdmin.email} 
                    onChange={e => setCurrentAdmin({...currentAdmin, email: e.target.value})}
                    required
                  />
                </div>

                <div className="ar-form-row">
                  <div className="ar-form-group">
                    <label>Role</label>
                    <select 
                      value={currentAdmin.role}
                      onChange={e => setCurrentAdmin({...currentAdmin, role: e.target.value})}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>

                  <div className="ar-form-group">
                    <label>Status</label>
                    <select 
                      value={currentAdmin.status}
                      onChange={e => setCurrentAdmin({...currentAdmin, status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="ar-modal-footer">
                <button type="button" className="ar-btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="ar-btn-save">{modalMode === 'edit' ? 'Save Changes' : 'Create Admin'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  )
}
