import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { User, Lock, LogOut } from 'lucide-react'
import logo from '../../assets/images/logo.png'
import { useLanguage } from '../../context/LanguageContext'
import LanguageSwitcher from '../common/LanguageSwitcher'
import './Navbar.css'

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const isLoggedIn = localStorage.getItem('authToken')
  const isHomePage = location.pathname === '/'

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
    setIsDropdownOpen(false)
    navigate('/')
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const closeDropdown = () => {
    setIsDropdownOpen(false)
  }

  const handleNavClick = () => {
    closeDropdown()
  }

  return (
    <nav className={`navbar ${isHomePage ? 'navbar-home' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo" onClick={handleNavClick}>
            <img src={logo} alt="CLEO Logo" className="logo-image" />
          </Link>
        </div>

        <div className="navbar-right">
          <div className="navbar-menu">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={handleNavClick}>{t('home')}</Link>
                <Link to="/log-period" className={`nav-link ${location.pathname === '/log-period' ? 'active' : ''}`} onClick={handleNavClick}>{t('logCycle')}</Link>
                <Link to="/log-symptoms" className={`nav-link ${location.pathname === '/log-symptoms' ? 'active' : ''}`} onClick={handleNavClick}>{t('symptoms')}</Link>
                <Link to="/mood" className={`nav-link ${location.pathname === '/mood' ? 'active' : ''}`} onClick={handleNavClick}>{t('mood')}</Link>
                <Link to="/calendar" className={`nav-link ${location.pathname === '/calendar' ? 'active' : ''}`} onClick={handleNavClick}>{t('calendar')}</Link>
                <Link to="/notes" className={`nav-link ${location.pathname === '/notes' ? 'active' : ''}`} onClick={handleNavClick}>{t('notes')}</Link>
                <Link to="/history" className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`} onClick={handleNavClick}>{t('history')}</Link>
                <Link to="/tips" className={`nav-link ${location.pathname === '/tips' ? 'active' : ''}`} onClick={handleNavClick}>{t('tips')}</Link>
              </>
            ) : (
              <>
                {isHomePage ? (
                  <>
                    <a href="#home" className="nav-link" onClick={handleNavClick}>Home</a>
                    <a href="#features" className="nav-link" onClick={handleNavClick}>Features</a>
                  </>
                ) : (
                  <>
                    <Link to="/" className="nav-link" onClick={handleNavClick}>Home</Link>
                    <a href="/#features" className="nav-link" onClick={handleNavClick}>Features</a>
                  </>
                )}
                <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={handleNavClick}>{t('about')}</Link>
                <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`} onClick={handleNavClick}>{t('login')}</Link>
              </>
            )}
          </div>

          {isLoggedIn ? (
            <div className="nav-profile-wrapper">
              <div 
                className="nav-profile-container" 
                onClick={toggleDropdown}
                title="Profile Settings"
              >
                <div className="profile-avatar-img">
                  <span className="avatar-placeholder">H</span>
                </div>
              </div>

              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={closeDropdown}>
                    <User size={18} />
                    <span>{t('profile')}</span>
                  </Link>
                  <Link to="/change-password" className="dropdown-item" onClick={closeDropdown}>
                    <Lock size={18} />
                    <span>{t('changePassword')}</span>
                  </Link>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signup" className="nav-signup-btn" onClick={handleNavClick}>{t('signup')}</Link>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  )
}
