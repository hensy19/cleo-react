import { Routes, Route } from 'react-router-dom'

// Public Pages
import Home from '../pages/public/Home'
import Login from '../pages/public/Login'
import Signup from '../pages/public/Signup'

// Onboarding
import OnboardingPage from '../pages/OnboardingPage'

// Dashboard Pages
import Dashboard from '../pages/dashboard/Dashboard'
import LogPeriod from '../pages/dashboard/LogPeriod'
import LogSymptoms from '../pages/dashboard/LogSymptoms'
import CalendarPage from '../pages/dashboard/CalendarPage'
import History from '../pages/dashboard/History'
import Tips from '../pages/dashboard/Tips'
import Profile from '../pages/dashboard/Profile'
import Mood from '../pages/dashboard/Mood'
import Notes from '../pages/dashboard/Notes'
import ChangePassword from '../pages/dashboard/ChangePassword'

// Admin Pages
import AdminLogin from '../pages/admin/AdminLogin'
import AdminDashboard from '../pages/admin/AdminDashboard'
import UserManagement from '../pages/admin/UserManagement'
import ContentManagement from '../pages/admin/ContentManagement'
import AdminRoles from '../pages/admin/AdminRoles'
import AdminSettingsGeneral from '../pages/admin/AdminSettingsGeneral'
import AdminSettingsPrivacy from '../pages/admin/AdminSettingsPrivacy'
import AdminSettingsContent from '../pages/admin/AdminSettingsContent'
import AdminSettingsData from '../pages/admin/AdminSettingsData'
import AdminProfile from '../pages/admin/AdminProfile'

// Route helpers
import ProtectedRoute from './ProtectedRoute'
import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Onboarding */}
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/log-period" element={<ProtectedRoute><LogPeriod /></ProtectedRoute>} />
      <Route path="/log-symptoms" element={<ProtectedRoute><LogSymptoms /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/mood" element={<ProtectedRoute><Mood /></ProtectedRoute>} />
      <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
      <Route path="/tips" element={<ProtectedRoute><Tips /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/content" element={<ContentManagement />} />
      <Route path="/admin/roles" element={<AdminRoles />} />
      <Route path="/admin/settings" element={<AdminSettingsGeneral />} />
      <Route path="/admin/settings/general" element={<AdminSettingsGeneral />} />
      <Route path="/admin/settings/privacy" element={<AdminSettingsPrivacy />} />
      <Route path="/admin/settings/content" element={<AdminSettingsContent />} />
      <Route path="/admin/settings/data" element={<AdminSettingsData />} />
      <Route path="/admin/profile" element={<AdminProfile />} />

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
