import { useState, useEffect } from 'react'
import { 
  User, 
  Mail, 
  Calendar, 
  Hash, 
  Activity, 
  Clock, 
  Notebook, 
  Heart, 
  Trash2, 
  LogOut,
  RotateCcw,
  CheckCircle2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import './Profile.css'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: 'Hensy Patel',
    email: 'hensypatel@gmail.com',
    dob: '01/01/2005',
    age: 19,
    cycleLength: 28,
    periodLength: 5,
    memberSince: 'Jan 2026',
    cyclesTracked: 2,
    notesCreated: 16,
    moodEntries: 42
  })

  const [goals, setGoals] = useState({
    water: { current: 1, target: 2, unit: 'L' },
    sleep: { current: 6, target: 8, unit: 'h' },
    mindfulness: { current: 10, target: 15, unit: 'm' }
  })

  useEffect(() => {
    // Check for goal completion and notify
    Object.keys(goals).forEach(key => {
      const goal = goals[key];
      if (goal.current >= goal.target && !goal.notified) {
        if (Notification.permission === "granted") {
          new Notification(`Goal Achieved! 🌟`, {
            body: `You've reached your daily ${key} goal. Amazing work!`,
          });
        }
        setGoals(prev => ({
          ...prev,
          [key]: { ...prev[key], notified: true }
        }));
      }
    });
  }, [goals]);

  const [isEditingGoals, setIsEditingGoals] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [showAddGoalModal, setShowAddGoalModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newGoalData, setNewGoalData] = useState({ name: '', target: 10, unit: '' })

  const handleResetGoals = () => {
    const resetGoals = {};
    Object.keys(goals).forEach(key => {
      resetGoals[key] = { ...goals[key], current: 0, notified: false };
    });
    setGoals(resetGoals);
    setShowResetModal(false);
  }

  const handleAddNewGoal = () => {
    if (newGoalData.name) {
      const key = newGoalData.name.toLowerCase().replace(/\s+/g, '');
      setGoals({...goals, [key]: { current: 0, target: newGoalData.target, unit: newGoalData.unit || '', notified: false }});
      setNewGoalData({ name: '', target: 10, unit: '' });
      setShowAddGoalModal(false);
    }
  }

  const handleCompleteGoal = (key) => {
    setGoals(prev => ({
      ...prev,
      [key]: { ...prev[key], current: prev[key].target }
    }));
  }

  const handleUpdateProfile = () => {
    localStorage.setItem('userInfo', JSON.stringify(user))
    alert('Profile updated successfully!')
  }

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    if (Object.keys(userInfo).length > 0) {
      setUser(prev => ({ ...prev, ...userInfo }))
    }
    
    // Dynamically calculate stats
    const notes = JSON.parse(localStorage.getItem('userNotes') || '[]')
    const moods = JSON.parse(localStorage.getItem('moodEntries') || '[]')
    
    setUser(prev => ({
      ...prev,
      notesCreated: notes.length,
      moodEntries: moods.length
    }))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
    navigate('/')
  }

  return (
    <DashboardLayout>
      <div className="profile-page-modern">
        <div className="profile-header-modern">
          <h1>My Profile</h1>
          <p>Manage your account and cycle information</p>
        </div>

        <div className="profile-grid-layout">
          {/* Left Column: Avatar & Delete Account */}
          <div className="profile-left-col">
            {/* Daily Health Goals Checklist */}
            <div className="profile-main-card">

              {/* Daily Health Goals */}
              <div className="info-block">
                <div className="filler-header">
                  <h3>Daily Goals</h3>
                  <div className="nudge-toggle-wrapper">
                    <span className="nudge-label">Nudge</span>
                    <label className="toggle-switch-mini">
                      <input type="checkbox" defaultChecked />
                      <span className="slider-mini round"></span>
                    </label>
                  </div>
                </div>
                
                <div className="health-goals-list">
                  {!isEditingGoals ? (
                    <>
                      {Object.keys(goals).map(key => {
                        const goal = goals[key];
                        const isDone = goal.current >= goal.target;
                        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                        const icon = key === 'water' ? '💧' : key === 'sleep' ? '😴' : key === 'mindfulness' ? '🧘' : '✨';
                        
                        return (
                          <div key={key} className={`goal-checklist-item ${isDone ? 'task-done' : ''}`}>
                            <div className="goal-info">
                              <span className="goal-label">{isDone ? '✅' : icon} {label}</span>
                              <div className="goal-controls">
                                {!isDone && (
                                  <button className="icon-action-btn" onClick={() => handleCompleteGoal(key)} title="Mark as Done">
                                    <CheckCircle2 size={16} />
                                  </button>
                                )}
                                <span className="goal-status-text">
                                  {goal.target}{goal.unit}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="goals-editor">
                      {Object.keys(goals).map(key => (
                        <div key={key} className="goal-edit-row">
                          <div className="goal-edit-item">
                            <label>{key.charAt(0).toUpperCase() + key.slice(1)} Target</label>
                            <div className="edit-input-group">
                              <input 
                                type="number" 
                                value={goals[key].target} 
                                onChange={(e) => setGoals({...goals, [key]: {...goals[key], target: parseInt(e.target.value) || 0}})}
                              />
                              <span className="unit-label">{goals[key].unit}</span>
                              {key !== 'water' && key !== 'sleep' && key !== 'mindfulness' && (
                                <button className="delete-goal-btn" onClick={() => {
                                  const newGoals = {...goals};
                                  delete newGoals[key];
                                  setGoals(newGoals);
                                }}>
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button className="add-goal-mini-btn" onClick={() => setShowAddGoalModal(true)}>
                        + Add New Goal
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="filler-actions">
                  <button 
                    className={`filler-action-btn ${isEditingGoals ? '' : 'btn-outline'}`} 
                    onClick={() => setIsEditingGoals(!isEditingGoals)}
                  >
                    {isEditingGoals ? 'Save Goals' : 'Edit Goals'}
                  </button>
                  {!isEditingGoals && (
                    <button className="filler-action-btn btn-outline icon-btn-only" onClick={() => setShowResetModal(true)} title="Reset Progress">
                      <RotateCcw size={16} />
                    </button>
                  )}
                  {isEditingGoals && (
                    <button className="filler-action-btn btn-outline" onClick={() => setIsEditingGoals(false)}>Cancel</button>
                  )}
                </div>
              </div>
            </div>

            <div className="delete-account-card">
              <div className="delete-header">
                <h3>Danger Zone</h3>
              </div>
              <p className="delete-warning">Warning: This action is permanent and will securely wipe all your data from our servers.</p>
              <button className="delete-btn-modern-full" onClick={() => setShowDeleteModal(true)}>Delete account</button>
            </div>
          </div>

          {/* Right Column: Editing Forms & Stats */}
          <div className="profile-right-col">
            <div className="profile-main-card form-card-full">
              {/* Horizontal Profile Header */}
              <div className="profile-horizontal-header">
                <div className="header-avatar-mini">
                  <span className="avatar-letter-small">H</span>
                </div>
                <div className="header-info-mini">
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
                </div>
                <div className="header-badge-status">
                  <span className="status-dot"></span> Active Profile
                </div>
              </div>

              <div className="profile-form-section">
                <div className="form-section-divider">
                  <h3>Personal Information</h3>
                </div>
                <div className="form-grid-row">
                  <div className="form-item">
                    <label><User size={14} /> Full Name</label>
                    <input 
                      type="text" 
                      value={user.name} 
                      onChange={(e) => setUser({...user, name: e.target.value})}
                    />
                  </div>
                  <div className="form-item">
                    <label><Mail size={14} /> Email</label>
                    <input 
                      type="email" 
                      value={user.email}
                      readOnly
                      className="input-readonly"
                    />
                  </div>
                  <div className="form-item">
                    <label><Calendar size={14} /> DOB</label>
                    <input 
                      type="text" 
                      value={user.dob}
                      onChange={(e) => setUser({...user, dob: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-section-divider">
                  <h3>Cycle Information</h3>
                </div>

                <div className="form-grid-row">
                  <div className="form-item">
                    <label>Age</label>
                    <input 
                      type="number" 
                      value={user.age}
                      onChange={(e) => setUser({...user, age: e.target.value})}
                    />
                  </div>
                  <div className="form-item">
                    <label>Avg cycle length</label>
                    <input 
                      type="number" 
                      value={user.cycleLength}
                      onChange={(e) => setUser({...user, cycleLength: e.target.value})}
                    />
                  </div>
                  <div className="form-item">
                    <label>Avg period length</label>
                    <input 
                      type="number" 
                      value={user.periodLength}
                      onChange={(e) => setUser({...user, periodLength: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-section-divider" style={{ marginTop: '0.5rem' }}>
                  <h3>Account Activity</h3>
                </div>
                
                <div className="profile-stats-grid-compact" style={{ padding: '0 0 2rem 0' }}>
                  <div className="stat-box">
                    <span className="stat-label">Member since</span>
                    <span className="stat-value">{user.memberSince}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Cycles Tracked</span>
                    <span className="stat-value">{user.cyclesTracked}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Notes Created</span>
                    <span className="stat-value">{user.notesCreated}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Mood Entries</span>
                    <span className="stat-value">{user.moodEntries}</span>
                  </div>
                </div>

                <div className="form-actions-modern">
                  <button className="update-profile-btn" onClick={handleUpdateProfile}>Save Changes</button>
                  <button className="cancel-btn">Cancel</button>
                  <div style={{ flex: 1 }}></div>
                  <button className="logout-btn-modern" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showResetModal && (
        <div className="reset-modal-overlay">
          <div className="reset-modal-card">
            <div className="modal-icon-red">
              <RotateCcw size={32} />
            </div>
            <h2>Reset Daily Goals?</h2>
            <p>This will clear all your progress for today. This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={() => setShowResetModal(false)}>Cancel</button>
              <button className="modal-reset-btn" onClick={handleResetGoals}>Yes, Reset</button>
            </div>
          </div>
        </div>
      )}

      {showAddGoalModal && (
        <div className="reset-modal-overlay">
          <div className="reset-modal-card">
            <div className="modal-icon-blue">
              <Heart size={32} />
            </div>
            <h2>New Health Goal</h2>
            <div className="modal-form-compact">
              <div className="modal-form-item">
                <label>Goal Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Yoga, Vitamin, Reading"
                  value={newGoalData.name}
                  onChange={(e) => setNewGoalData({...newGoalData, name: e.target.value})}
                />
              </div>
              <div className="modal-form-row">
                <div className="modal-form-item">
                  <label>Target</label>
                  <input 
                    type="number" 
                    value={newGoalData.target}
                    onChange={(e) => setNewGoalData({...newGoalData, target: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="modal-form-item">
                  <label>Unit</label>
                  <input 
                    type="text" 
                    placeholder="e.g. m, steps"
                    value={newGoalData.unit}
                    onChange={(e) => setNewGoalData({...newGoalData, unit: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="modal-cancel-btn" onClick={() => setShowAddGoalModal(false)}>Cancel</button>
              <button className="modal-reset-btn" style={{ background: 'var(--primary-color)' }} onClick={handleAddNewGoal}>Add Goal</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="reset-modal-overlay">
          <div className="reset-modal-card">
            <div className="modal-icon-red">
              <Trash2 size={32} />
            </div>
            <h2>Delete Account?</h2>
            <p>This action is <strong>permanent</strong>. You will lose all your cycle history, health data, and profile settings forever.</p>
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="modal-cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="modal-reset-btn" onClick={() => {
                // Handle actual deletion logic here
                alert("Account deleted successfully (Demo)");
                handleLogout();
              }}>Yes, Delete Everything</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
