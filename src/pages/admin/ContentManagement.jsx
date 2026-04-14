import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { useNotifications } from '../../context/NotificationContext'
import './ContentManagement.css'

// Mock Tip Data matching the image contents
const MOCK_TIPS = [
  { id: 1, category: "Diet and nutrition", title: "Iron-Rich Foods", content: "Include spinach and lentils during menstruation", status: "published" },
  { id: 2, category: "Exercise", title: "Gentle Workouts", content: "Try yoga or walking during your period.", status: "published" },
  { id: 3, category: "PMS Relief", title: "Mood Support", content: "Practice mindfulness and meditation.", status: "published" },
  { id: 4, category: "Hygiene", title: "Iron-Rich Foods", content: "Include spinach and lentils during menstruation", status: "draft" },
  { id: 5, category: "Diet and nutrition", title: "Iron-Rich Foods", content: "Include spinach and lentils during menstruation", status: "published" },
  { id: 6, category: "PMS Relief", title: "Mood Support", content: "Practice mindfulness and meditation.", status: "published" },
  { id: 7, category: "Hygiene", title: "Iron-Rich Foods", content: "Include spinach and lentils during menstruation", status: "published" },
  { id: 8, category: "Diet and nutrition", title: "Iron-Rich Foods", content: "Include spinach and lentils during menstruation", status: "published" },
  { id: 9, category: "Exercise", title: "Strength Training", content: "During the follicular phase, you may have more energy for intense workouts.", status: "published" },
  { id: 10, category: "Exercise", title: "Gentle Movement", content: "Light yoga or walking can help reduce menstrual cramps.", status: "published" },
]

const CATEGORY_OPTIONS = [
  "Diet and nutrition",
  "Exercise",
  "PMS Relief",
  "Hygiene",
  "Wellness"
]

export default function ContentManagement() {
  const navigate = useNavigate()
  const { showModal, showToast } = useNotifications()
  
  // States
  const [tips, setTips] = useState(MOCK_TIPS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('view') // 'view' | 'edit' | 'new'
  const [currentTip, setCurrentTip] = useState(null)
  
  const dropdownRef = useRef(null)

  // Auth check
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      navigate('/admin/login')
    }
  }, [navigate])

  // Handle outside click for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filtering Logic
  const filteredTips = tips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tip.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory ? tip.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  // Handlers
  const handleDelete = (id) => {
    showModal({
      title: 'Delete Tip',
      message: 'Are you sure you want to delete this tip? This article will be permanently removed.',
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: () => {
        setTips(tips.filter(t => t.id !== id))
        showToast('Tip deleted successfully!')
      }
    })
  }

  const openModal = (tip, mode) => {
    setCurrentTip(tip ? { ...tip } : { category: CATEGORY_OPTIONS[0], title: '', content: '', status: 'draft' })
    setModalMode(mode)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentTip(null)
  }

  const handleModalSave = (e) => {
    e.preventDefault()
    if (modalMode === 'edit') {
      setTips(tips.map(t => t.id === currentTip.id ? currentTip : t))
      showToast('Tip updated successfully!')
    } else if (modalMode === 'new') {
      const newTip = { ...currentTip, id: Date.now() }
      setTips([newTip, ...tips])
      showToast('Tip created successfully!')
    }
    closeModal()
  }

  return (
    <AdminLayout activePage="content">
      {/* Page Header */}
      <div className="cm-header-container">
        <div>
          <h1 className="cm-title">Content management</h1>
          <p className="cm-subtitle">Manage articles and guides</p>
        </div>
        <button className="cm-btn-new" onClick={() => openModal(null, 'new')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Article
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="cm-stats-grid">
        <div className="cm-stat-card">
          <svg className="cm-stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H15"/><path d="M12 21v-4"/><path d="M12 17a4 4 0 1 0-4-4c0 3 2 4 2 4h4s2-1 2-4a4 4 0 1 0-4 4z"/></svg>
          <div className="cm-stat-info">
            <span className="cm-stat-num">13</span>
            <span className="cm-stat-lbl">Total Tips</span>
          </div>
        </div>
        <div className="cm-stat-card">
          <svg className="cm-stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <div className="cm-stat-info">
            <span className="cm-stat-num">12</span>
            <span className="cm-stat-lbl">Published</span>
          </div>
        </div>
        <div className="cm-stat-card">
          <svg className="cm-stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <div className="cm-stat-info">
            <span className="cm-stat-num">2</span>
            <span className="cm-stat-lbl">Drafts</span>
          </div>
        </div>
        <div className="cm-stat-card">
          <svg className="cm-stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <div className="cm-stat-info">
            <span className="cm-stat-num">6</span>
            <span className="cm-stat-lbl">Categories</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="cm-toolbar">
        <div className="cm-search-box">
          <svg width="18" height="18" fill="none" stroke="#A0AEC0" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Search articles..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="cm-dropdown-container" ref={dropdownRef}>
          <button 
            className="cm-dropdown-btn" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedCategory || 'Categories'} 
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          
          {isDropdownOpen && (
            <div className="cm-dropdown-menu">
              <div 
                className={`cm-dropdown-item ${selectedCategory === '' ? 'active' : ''}`}
                onClick={() => { setSelectedCategory(''); setIsDropdownOpen(false); }}
              >
                All Categories
              </div>
              {CATEGORY_OPTIONS.map(cat => (
                <div 
                  key={cat}
                  className={`cm-dropdown-item ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory(cat); setIsDropdownOpen(false); }}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Table Area */}
      <div className="cm-table-wrapper">
        <div className="cm-table-header-title">
          <h2>Manage Tips</h2>
          <p>View, edit and delete tips</p>
        </div>
        
        <table className="cm-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Title</th>
              <th>Content</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTips.map(tip => (
              <tr key={tip.id}>
                <td className="cm-td-category">{tip.category}</td>
                <td className="cm-td-title">{tip.title}</td>
                <td className="cm-td-content">{tip.content}</td>
                <td>
                  <span className={`cm-status-pill ${tip.status === 'published' ? 'status-pub' : 'status-draft'}`}>
                    {tip.status}
                  </span>
                </td>
                <td>
                  <div className="cm-actions">
                    <button className="cm-action-icon view" onClick={() => openModal(tip, 'view')} title="View">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <button className="cm-action-icon edit" onClick={() => openModal(tip, 'edit')} title="Edit">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button className="cm-action-icon del" onClick={() => handleDelete(tip.id)} title="Delete">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredTips.length === 0 && (
              <tr>
                <td colSpan="5" className="cm-no-results">No articles match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Interactive Modal */}
      {isModalOpen && currentTip && (
        <div className="cm-modal-overlay" onClick={closeModal}>
          <div className="cm-modal-content" onClick={e => e.stopPropagation()}>
            <div className="cm-modal-header">
              <h2>
                {modalMode === 'view' ? 'View Article' : 
                 modalMode === 'edit' ? 'Edit Article' : 'New Article'}
              </h2>
              <button className="cm-modal-close" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={handleModalSave}>
              <div className="cm-modal-body">
                <div className="cm-form-group">
                  <label>Title</label>
                  {modalMode === 'view' ? (
                    <div className="cm-view-field">{currentTip.title}</div>
                  ) : (
                    <input 
                      type="text" 
                      value={currentTip.title} 
                      onChange={e => setCurrentTip({...currentTip, title: e.target.value})}
                      required
                    />
                  )}
                </div>

                <div className="cm-form-row">
                  <div className="cm-form-group">
                    <label>Category</label>
                    {modalMode === 'view' ? (
                      <div className="cm-view-field">{currentTip.category}</div>
                    ) : (
                      <select 
                        value={currentTip.category}
                        onChange={e => setCurrentTip({...currentTip, category: e.target.value})}
                      >
                        {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    )}
                  </div>

                  <div className="cm-form-group">
                    <label>Status</label>
                    {modalMode === 'view' ? (
                      <span className={`cm-status-pill ${currentTip.status === 'published' ? 'status-pub' : 'status-draft'}`}>
                        {currentTip.status}
                      </span>
                    ) : (
                      <select 
                        value={currentTip.status}
                        onChange={e => setCurrentTip({...currentTip, status: e.target.value})}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    )}
                  </div>
                </div>

                <div className="cm-form-group">
                  <label>Content</label>
                  {modalMode === 'view' ? (
                    <div className="cm-view-field min-h-24">{currentTip.content}</div>
                  ) : (
                    <textarea 
                      rows="4" 
                      value={currentTip.content}
                      onChange={e => setCurrentTip({...currentTip, content: e.target.value})}
                      required
                    />
                  )}
                </div>
              </div>
              
              <div className="cm-modal-footer">
                <button type="button" className="cm-btn-cancel" onClick={closeModal}>Close</button>
                {modalMode !== 'view' && (
                  <button type="submit" className="cm-btn-save">Save Changes</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  )
}
