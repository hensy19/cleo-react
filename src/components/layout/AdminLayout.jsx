import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import './AdminLayout.css'

export default function AdminLayout({ children, activePage = 'dashboard', onSearch }) {
  const navigate = useNavigate()
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(activePage.startsWith('settings'))

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminInfo')
    navigate('/admin/login')
  }

  const handleSearchChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value)
    }
  }

  const toggleSettings = (e) => {
    e.preventDefault()
    setIsSettingsOpen(!isSettingsOpen)
  }

  return (
    <div className="admin-app-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="admin-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src={logo} alt="CLEO Logo" className="admin-logo-image" />
          </div>

          <div className="admin-nav-section">
            <div className="nav-section-title">Home</div>
            <nav className="admin-nav-links">
              <a href="/admin/dashboard" className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                Dashboard
              </a>
              <a href="/admin/users" className={`nav-item ${activePage === 'users' ? 'active' : ''}`}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Users
              </a>
              <a href="/admin/content" className={`nav-item ${activePage === 'content' ? 'active' : ''}`}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Content
              </a>
              
              
              {/* Settings Accordion */}
              <a href="#settings" onClick={toggleSettings} className={`nav-item with-dropdown ${activePage.startsWith('settings') ? 'active' : ''}`}>
                <div className="nav-item-left">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  Settings
                </div>
                <svg className="dropdown-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ transform: isSettingsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </a>
              
              {isSettingsOpen && (
                <div className="admin-nav-submenu">
                  <a href="/admin/settings/general" className={`submenu-item ${activePage === 'settings-general' ? 'active' : ''}`}>
                    <span className="submenu-dot"></span> General Settings
                  </a>
                  <a href="/admin/settings/privacy" className={`submenu-item ${activePage === 'settings-privacy' ? 'active' : ''}`}>
                    <span className="submenu-dot"></span> Privacy and security
                  </a>
                  <a href="/admin/settings/content" className={`submenu-item ${activePage === 'settings-content' ? 'active' : ''}`}>
                    <span className="submenu-dot"></span> Content controls
                  </a>
                  <a href="/admin/settings/data" className={`submenu-item ${activePage === 'settings-data' ? 'active' : ''}`}>
                    <span className="submenu-dot"></span> Data Management
                  </a>
                </div>
              )}
            </nav>
          </div>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="active-users-list">
            <div className="list-title">Most active users</div>
            <div className="active-user"><span className="dot dot-red"></span>Hensy Patel</div>
            <div className="active-user"><span className="dot dot-blue"></span>Ridhdhi Raval</div>
            <div className="active-user"><span className="dot dot-purple"></span>Komal Mishra</div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
             <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
             Log out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="search-bar">
            <svg width="18" height="18" fill="none" stroke="#9E9E9E" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search" 
              onChange={handleSearchChange} 
            />
          </div>
          <div 
            className="admin-profile-icon" 
            onClick={() => navigate('/admin/profile')} 
            title="My Profile"
            style={{ cursor: 'pointer' }}
          >
            <svg width="20" height="20" fill="none" stroke="#3B82F6" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="admin-page-body">
          {children}
        </div>
      </main>
    </div>
  )
}
