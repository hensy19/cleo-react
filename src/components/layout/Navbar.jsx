import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import './Navbar.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isLoggedIn = localStorage.getItem('authToken')
  const isHomePage = location.pathname === '/'

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
    setIsMenuOpen(false)
    navigate('/')
  }

  const handleNavClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className={`navbar ${isHomePage ? 'navbar-home' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleNavClick}>
          <img src={logo} alt="CLEO Logo" className="logo-image" />
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={handleNavClick}>Dashboard</Link>
              <Link to="/calendar" className="nav-link" onClick={handleNavClick}>Calendar</Link>
              <Link to="/log-symptoms" className="nav-link" onClick={handleNavClick}>Symptoms</Link>
              <Link to="/log-period" className="nav-link" onClick={handleNavClick}>Log Period</Link>
              <Link to="/history" className="nav-link" onClick={handleNavClick}>History</Link>
              <Link to="/mood" className="nav-link" onClick={handleNavClick}>Mood</Link>
              <Link to="/notes" className="nav-link" onClick={handleNavClick}>Notes</Link>
              <Link to="/tips" className="nav-link" onClick={handleNavClick}>Tips</Link>
              <Link to="/profile" className="nav-link" onClick={handleNavClick}>Profile</Link>
              <button className="nav-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              {isHomePage && (
                <>
                  <a href="#home" className="nav-link" onClick={handleNavClick}>Home</a>
                  <a href="#features" className="nav-link" onClick={handleNavClick}>Features</a>
                  <a href="#how-it-works" className="nav-link" onClick={handleNavClick}>How it Works</a>
                </>
              )}
              <Link to="/login" className="nav-link" onClick={handleNavClick}>Login</Link>
              <Link to="/signup" className="nav-button" onClick={handleNavClick}>Sign Up</Link>
            </>
          )}
        </div>

        <button 
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}
