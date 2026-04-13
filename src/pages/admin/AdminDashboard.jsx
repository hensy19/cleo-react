import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [adminInfo, setAdminInfo] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      navigate('/admin/login')
      return
    }

    const info = JSON.parse(localStorage.getItem('adminInfo') || '{}')
    setAdminInfo(info)
  }, [navigate])

  const statCards = [
    { title: "Total Users", value: "2,481", growth: "↑ 12.5%", isPositive: true, iconClass: "icon-purple", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    )},
    { title: "Active Users", value: "1,764", growth: "↑ 8.2%", isPositive: true, iconClass: "icon-pink", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    )},
    { title: "Monthly Signups", value: "356", growth: "↑ 10.7%", isPositive: true, iconClass: "icon-lightblue", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
    )},
    { title: "Avg Cycle Length Rate", value: "28.4 days", growth: "↓ 0.3%", isPositive: false, iconClass: "icon-blue", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    )}
  ];

  const recentUsers = [
    { name: "Komal Mishra", email: "komal@gmail.com", initials: "KM", action: "Logged cycle day 14", time: "2 mins ago", status: "Active" },
    { name: "Ridhdhi Raval", email: "ridhdhi.raval@gmail.com", initials: "RR", action: "Updated symptoms", time: "12 mins ago", status: "Active" },
    { name: "Olivia Brown", email: "olivia.brown@gmail.com", initials: "OB", action: "Started new cycle", time: "1 hour ago", status: "Active" },
    { name: "Sophia Davis", email: "sophia.davis@gmail.com", initials: "SD", action: "Updated profile", time: "2 hours ago", status: "Active" },
    { name: "Ava Martinez", email: "ava.martinez@gmail.com", initials: "AM", action: "Started new cycle", time: "3 hours ago", status: "Active" },
    { name: "Isabella Garcia", email: "isabella.garcia@gmail.com", initials: "IG", action: "Updated profile", time: "5 hours ago", status: "Active" },
  ];

  if (!adminInfo) return null

  return (
    <AdminLayout activePage="dashboard">
        {/* Dashboard Title */}
        <div className="dashboard-title-section">
          <h1>Dashboard Overview</h1>
          <p>Welcome back, here's what's happening today</p>
        </div>

        {/* Stats Row */}
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
                <div className="d-stat-value">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Section: Chart & Quick Stats */}
        <div className="dashboard-middle-section">
          <div className="chart-card">
            <div className="chart-header">
              <h2>User Growth</h2>
              <div className="chart-subtitle">
                Total Users : 2,481 <span className="growth-text">+12%</span> vs last month
              </div>
            </div>
            {/* SVG Mockup of the Chart */}
            <div className="chart-area-mockup">
               <svg viewBox="0 0 400 170" className="chart-svg" preserveAspectRatio="none">
                 {/* Grid Lines */}
                 <path d="M40 20 L380 20" stroke="#F0F0F0" strokeWidth="1" />
                 <path d="M40 50 L380 50" stroke="#F0F0F0" strokeWidth="1" />
                 <path d="M40 80 L380 80" stroke="#F0F0F0" strokeWidth="1" />
                 <path d="M40 110 L380 110" stroke="#F0F0F0" strokeWidth="1" />
                 {/* Y Axis Labels */}
                 <text x="30" y="24" fontSize="10" fill="#999" textAnchor="end">2,500</text>
                 <text x="30" y="54" fontSize="10" fill="#999" textAnchor="end">2,000</text>
                 <text x="30" y="84" fontSize="10" fill="#999" textAnchor="end">1,500</text>
                 <text x="30" y="114" fontSize="10" fill="#999" textAnchor="end">1,000</text>
                 {/* X Axis Labels */}
                 <text x="50" y="155" fontSize="10" fill="#999">Jan</text>
                 <text x="100" y="155" fontSize="10" fill="#999">Feb</text>
                 <text x="150" y="155" fontSize="10" fill="#999">Mar</text>
                 <text x="200" y="155" fontSize="10" fill="#999">Apr</text>
                 <text x="250" y="155" fontSize="10" fill="#999">May</text>
                 <text x="300" y="155" fontSize="10" fill="#999">Jun</text>

                 {/* The Line */}
                 <path d="M50 110 L100 95 L150 80 L200 55 L250 45 L300 25" fill="none" stroke="#6C5CE7" strokeWidth="3" />
                 
                 {/* Dots */}
                 <circle cx="50" cy="110" r="4" fill="#FFFFFF" stroke="#6C5CE7" strokeWidth="2" />
                 <circle cx="100" cy="95" r="4" fill="#FFFFFF" stroke="#6C5CE7" strokeWidth="2" />
                 <circle cx="150" cy="80" r="4" fill="#FFFFFF" stroke="#6C5CE7" strokeWidth="2" />
                 <circle cx="200" cy="55" r="4" fill="#FFFFFF" stroke="#6C5CE7" strokeWidth="2" />
                 <circle cx="250" cy="45" r="4" fill="#FFFFFF" stroke="#6C5CE7" strokeWidth="2" />
                 <circle cx="300" cy="25" r="4" fill="#FFFFFF" stroke="#6C5CE7" strokeWidth="2" />
               </svg>
            </div>
          </div>

          <div className="quick-stats-card">
            <h2>Quick Stats</h2>
            <div className="q-stat-item">
              <div className="q-stat-left">
                <span className="q-stat-label">New Today</span>
                <span className="q-stat-val">47</span>
              </div>
              <div className="q-stat-icon is-purple">
                 <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
              </div>
            </div>
            
            <div className="q-stat-item">
              <div className="q-stat-left">
                <span className="q-stat-label">Logs Today</span>
                <span className="q-stat-val">184</span>
              </div>
              <div className="q-stat-icon is-blue">
                 <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
            </div>

            <div className="q-stat-item">
              <div className="q-stat-left">
                <span className="q-stat-label">Tips Added Today</span>
                <span className="q-stat-val">5</span>
              </div>
              <div className="q-stat-icon is-lightblue">
                 <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent User Activity */}
        <div className="recent-activity-card">
          <div className="recent-header">
            <h2>Recent User Activity</h2>
            <p>Latest user interactions</p>
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
                {recentUsers.map((user, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="user-info-cell">
                        <div className="user-avatar">{user.initials}</div>
                        <div className="user-details">
                          <span className="user-name">{user.name}</span>
                          <span className="user-email">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{user.action}</td>
                    <td>{user.time}</td>
                    <td>
                      <span className="status-pill active-pill">{user.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </AdminLayout>
  )
}
