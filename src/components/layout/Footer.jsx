import { Link } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  const { logoUrl } = useSettings()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-brand">
          <Link to="/">
            <img src={logoUrl} alt="CLEO Logo" className="footer-logo" />
          </Link>
          <p>Track and understand your menstrual cycle with ease.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@cleo.app</p>
          <div className="social-links">
            <a href="#facebook">Facebook</a>
            <a href="#twitter">Twitter</a>
            <a href="#instagram">Instagram</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} CLEO. All rights reserved.</p>
      </div>
    </footer>
  )
}
