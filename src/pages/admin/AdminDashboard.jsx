import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { api } from '../../utils/api'
import { getInitials, getRelativeTime } from '../../utils/helpers'
import './AdminDashboard.css'

import { UserGrowthChart, ActivityBreakdownChart } from './components/DashboardGraph'

export default function AdminDashboard() {
  const [adminInfo, setAdminInfo] = useState(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    monthlySignups: 0,
    avgCycle: '28.0',
    newToday: 0,
    userGrowth: [],
    dailyLogs: [],
    activityBreakdown: []
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      navigate('/admin/login')
      return
    }

    const info = JSON.parse(localStorage.getItem('adminInfo') || '{}')
    setAdminInfo(info)
    fetchDashboardData()
  }, [navigate])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const data = await api.getAdminStats()
      const activityData = await api.getAdminActivity()
      
      setStats(data)
      setRecentActivity(activityData)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Users", value: stats.totalUsers.toLocaleString(), growth: "↑ 100%", isPositive: true, iconClass: "icon-purple", icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
      )
    },
    {
      title: "Active Users", value: stats.activeUsers.toLocaleString(), growth: "↑ 100%", isPositive: true, iconClass: "icon-pink", icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
      )
    },
    {
      title: "Monthly Signups", value: stats.monthlySignups.toLocaleString(), growth: "↑ 100%", isPositive: true, iconClass: "icon-lightblue", icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
      )
    },
    {
      title: "Avg Cycle Length", value: `${stats.avgCycle} days`, growth: "—", isPositive: true, iconClass: "icon-blue", icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
      )
    }
  ];

  if (!adminInfo) return null

  return (
    <AdminLayout activePage="dashboard">
      <div className="dashboard-title-section">
        <h1>Dashboard Overview</h1>
        <p>Welcome back, here's what's happening today</p>
      </div>

      <div className="d-stats-grid">
        {statCards.map((stat, idx) => (
          <div className="d-stat-card" key={idx}>
            <div className="d-stat-header">
              <span className="d-stat-title">{stat.title}</span>
              <span className={`d-stat-badge ${stat.isPositive ? 'badge-green' : 'badge-red'}`}>{stat.growth}</span>
            </div>
            <div className="d-stat-body">
              <div className={`d-stat-icon-wrapper ${stat.iconClass}`}>
                {stat.icon}
              </div>
              <div className="d-stat-value">{isLoading ? "..." : stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-middle-section">
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-header-left">
              <h2>User Growth</h2>
              <div className="chart-subtitle">
                Total Users : {stats.totalUsers.toLocaleString()} <span className="growth-text">+100%</span> vs last 14 days
              </div>
            </div>
            <div className="chart-header-right">
              <div className="mini-stat">
                <span className="mini-stat-label">New Today</span>
                <span className="mini-stat-val">+{stats.newToday}</span>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-label">Active (7d)</span>
                <span className="mini-stat-val">{stats.activeUsers}</span>
              </div>
            </div>
          </div>
          <div className="chart-area">
            <UserGrowthChart data={stats.userGrowth} loading={isLoading} />
          </div>
        </div>

        <div className="quick-stats-card">
          <div className="q-stats-header">
            <div className="q-stats-header-left">
              <h2>Activity Insights</h2>
              <span className="q-stats-period">Overall Breakdown</span>
            </div>
            <div className="q-stats-header-right">
              <div className="total-activity-badge">
                <span className="activity-count">
                  {stats.dailyLogs.reduce((acc, curr) => acc + parseInt(curr.logs || 0), 0).toLocaleString()}
                </span>
                <span className="activity-label">TOTAL LOGS</span>
              </div>
            </div>
          </div>
          
          <div className="activity-breakdown-wrapper">
             <ActivityBreakdownChart data={stats.activityBreakdown} loading={isLoading} />
          </div>
        </div>
      </div>

      <div className="recent-activity-card">
        <div className="recent-header">
          <h2>Recent User Activity</h2>
          <p>Latest user interactions from all logs</p>
        </div>

        <div className="activity-table-wrapper">
          <table className="activity-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading activity...</td></tr>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="user-info-cell">
                        <div className="user-avatar">{getInitials(activity.name)}</div>
                        <div className="user-details">
                          <span className="user-name">{activity.name}</span>
                          <span className="user-email">{activity.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{activity.action}</td>
                    <td>{getRelativeTime(activity.time)}</td>
                    <td>
                      <span className="status-pill active-pill">{activity.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No recent activity found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

