import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import NotificationProvider from './context/NotificationProvider'
import { LanguageProvider } from './context/LanguageContext'
import './styles/layout.css'

function App() {
  return (
    <Router>
      <LanguageProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </LanguageProvider>
    </Router>
  )
}

export default App
