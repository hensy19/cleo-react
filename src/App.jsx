import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import NotificationProvider from './context/NotificationProvider'
import './styles/layout.css'

function App() {
  return (
    <Router>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </Router>
  )
}

export default App
