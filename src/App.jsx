import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import NotificationProvider from './context/NotificationProvider'
import { LanguageProvider } from './context/LanguageContext'
import { SettingsProvider } from './context/SettingsContext'
import { useAutoLogout } from './hooks/useAutoLogout'
import './styles/layout.css'

function AppContent() {
  // Activate automatic logout listener
  useAutoLogout();
  
  return <AppRoutes />;
}

function App() {
  return (
    <Router>
      <SettingsProvider>
        <LanguageProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </LanguageProvider>
      </SettingsProvider>
    </Router>
  )
}

export default App
