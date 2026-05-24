import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { attendanceService, AttendanceRecord } from '../services/attendanceService';
import '../styles/home.css';

type View = 'dashboard' | 'attendance' | 'profile' | 'settings';

export default function HomePage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch attendance history
  useEffect(() => {
    if (user?.id) {
      fetchAttendance();
    }
  }, [user?.id]);

  const fetchAttendance = async () => {
    try {
      const history = await attendanceService.getUserAttendance(user.id);
      setAttendanceHistory(history);
      
      // Check if already marked for today
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = history.find(record => record.date === today);
      if (todayRecord) {
        setAttendanceMarked(true);
        setCheckInTime(new Date(todayRecord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleMarkAttendance = async () => {
    try {
      const record = await attendanceService.markAttendance(user.id);
      setAttendanceMarked(true);
      setCheckInTime(new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      fetchAttendance(); // Refresh history
    } catch (error: any) {
      alert(error.response?.data || 'Failed to mark attendance');
    }
  };

  const renderDashboard = () => (
    <div className="view-container">
      <div className="welcome-section" style={{ textAlign: 'left', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>Hello, {user?.firstname || 'User'}! 👋</h2>
          <p className="subtitle" style={{ marginTop: '0.5rem' }}>Welcome back to your attendance command center.</p>
        </div>
        <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.03)', padding: '1rem 1.5rem', borderRadius: '20px', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{currentTime.toLocaleTimeString()}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>✓</div>
          <div className="stat-info">
            <h4>Attendance</h4>
            <div className="value">94%</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>📅</div>
          <div className="stat-info">
            <h4>Days Present</h4>
            <div className="value">42</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>⌛</div>
          <div className="stat-info">
            <h4>Late Entries</h4>
            <div className="value">3</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Attendance Action Card */}
        <div className="glass-card" style={{ border: attendanceMarked ? '1px solid #10b981' : '1px solid var(--primary)', gridColumn: 'span 1' }}>
          <h3 style={{ color: attendanceMarked ? '#10b981' : 'inherit' }}>
            {attendanceMarked ? '✓ Today Checked' : '📅 Daily Check-in'}
          </h3>
          <p>Ready for today's session? Mark your presence below to keep your streak going.</p>
          {!attendanceMarked ? (
            <button className="cool-btn" onClick={handleMarkAttendance}>
              Check-In Now
            </button>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', border: '1px dashed #10b981' }}>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1.1rem' }}>Success!</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Recorded at {checkInTime}</div>
            </div>
          )}
        </div>

        <div className="glass-card">
          <h3>🕒 Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot"></div>
              <div className="activity-content">
                <div className="activity-title">Logged in from Web</div>
                <div className="activity-time">Just now</div>
              </div>
            </div>
            {attendanceMarked && (
              <div className="activity-item">
                <div className="activity-dot" style={{ background: '#10b981' }}></div>
                <div className="activity-content">
                  <div className="activity-title">Attendance Marked</div>
                  <div className="activity-time">{checkInTime}</div>
                </div>
              </div>
            )}
            <div className="activity-item">
              <div className="activity-dot" style={{ background: 'var(--text-muted)' }}></div>
              <div className="activity-content">
                <div className="activity-title">Weekly report generated</div>
                <div className="activity-time">Yesterday, 4:30 PM</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card">
          <h3>🚀 Quick Actions</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <button className="cool-btn secondary" onClick={() => setActiveView('attendance')} style={{ justifyContent: 'flex-start' }}>
              <span>📊 View History</span>
            </button>
            <button className="cool-btn secondary" onClick={() => setActiveView('profile')} style={{ justifyContent: 'flex-start' }}>
              <span>👤 Update Profile</span>
            </button>
            <button className="cool-btn secondary" onClick={() => setActiveView('settings')} style={{ justifyContent: 'flex-start' }}>
              <span>⚙️ Account Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="view-container">
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Attendance History</h2>
      <div className="glass-card">
        <table className="cool-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Check-in Time</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {attendanceHistory.length > 0 ? (
              attendanceHistory.map(record => (
                <tr key={record.id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>
                    <span className={record.status === 'PRESENT' ? 'badge-present' : 'badge-late'}>
                      {record.status}
                    </span>
                  </td>
                  <td>{new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>Automatically recorded via Web Portal</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No attendance records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="view-container">
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>User Profile</h2>
      <div className="glass-card" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'center' }}>
          <div className="avatar-circle" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
            {user?.firstname?.[0] || 'U'}
          </div>
          <div>
            <h4 style={{ fontSize: '1.5rem' }}>{user?.firstname} {user?.lastname}</h4>
            <p style={{ color: 'var(--text-muted)' }}>{user?.role || 'Student'}</p>
          </div>
        </div>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>First Name</label>
            <input type="text" className="cool-input" defaultValue={user?.firstname} />
          </div>
          <div>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Last Name</label>
            <input type="text" className="cool-input" defaultValue={user?.lastname} />
          </div>
          <div>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email Address</label>
            <input type="email" className="cool-input" defaultValue={user?.email} readOnly style={{ opacity: 0.7 }} />
          </div>
          <button className="cool-btn" style={{ marginTop: '1rem' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="view-container">
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>System Settings</h2>
      <div className="glass-card" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <span>Push Notifications</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <span>Dark Mode Appearance</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <span>Show Profile to Others</span>
            <input type="checkbox" />
          </div>
          <button className="cool-btn" style={{ marginTop: '2rem' }}>Apply Preferences</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="home-container">
      <aside className="sidebar">
        <div className="logo-area">
          <h1>AttendEase</h1>
        </div>
        
        <nav className="nav-links">
          <button 
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            <span>🏠 Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeView === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveView('attendance')}
          >
            <span>📅 Attendance</span>
          </button>
          <button 
            className={`nav-item ${activeView === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveView('profile')}
          >
            <span>👤 Profile</span>
          </button>
          <button 
            className={`nav-item ${activeView === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveView('settings')}
          >
            <span>⚙️ Settings</span>
          </button>

          <button onClick={handleLogout} className="nav-item logout-nav-item">
            <span>🚪 Logout</span>
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header-top">
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            System Status: <span style={{ color: '#10b981' }}>● Online</span>
          </div>
          <div className="user-badge">
            <span style={{ fontWeight: 600 }}>{user?.firstname}</span>
            <div className="avatar-circle">
              {user?.firstname?.[0]}
            </div>
          </div>
        </header>

        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'attendance' && renderAttendance()}
        {activeView === 'profile' && renderProfile()}
        {activeView === 'settings' && renderSettings()}

        <footer style={{ marginTop: '4rem', color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
          &copy; 2026 AttendEase Intelligence Systems. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
