import { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import NotificationProvider from './context/NotificationProvider'
import GoalReminderManager from './components/common/GoalReminderManager'
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
  useEffect(() => {
    // Request notification permission silently on load
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Router>
      <SettingsProvider>
        <LanguageProvider>
          <NotificationProvider>
            <GoalReminderManager />
            <AppContent />
          </NotificationProvider>
        </LanguageProvider>
      </SettingsProvider>
    </Router>
  )
}

export default App
