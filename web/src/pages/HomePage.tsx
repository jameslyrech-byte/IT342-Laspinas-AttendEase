<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React from 'react';
>>>>>>> 22472d3ea753ec6ffce45255a8580bf00526b655
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/home.css';

<<<<<<< HEAD
type View = 'dashboard' | 'attendance' | 'profile' | 'settings';

export default function HomePage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
=======
export default function HomePage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
>>>>>>> 22472d3ea753ec6ffce45255a8580bf00526b655

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

<<<<<<< HEAD
  const handleMarkAttendance = () => {
    setAttendanceMarked(true);
    setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const renderDashboard = () => (
    <div className="view-container">
      <div className="welcome-section" style={{ textAlign: 'left', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Hello, {user?.firstname || 'User'}! 👋</h2>
          <p className="subtitle">Here's what's happening with your attendance today.</p>
        </div>
        <div style={{ textAlign: 'right', background: 'var(--bg-card)', padding: '1rem 1.5rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{currentTime.toLocaleTimeString()}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Attendance Action Card */}
        <div className="glass-card" style={{ border: attendanceMarked ? '1px solid #10b981' : '1px solid var(--primary)' }}>
          <h3>📅 Daily Attendance</h3>
          <p>Ready for today's session? Mark your presence below.</p>
          {!attendanceMarked ? (
            <button className="cool-btn" onClick={handleMarkAttendance}>
              Mark Attendance for Today
            </button>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1.1rem' }}>✓ Checked In Successfully</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Recorded at: {checkInTime}</div>
            </div>
          )}
        </div>

        <div className="glass-card">
          <h3>📊 Weekly Summary</h3>
          <p>You have maintained a 95% attendance rate this semester. Keep up the good work!</p>
          <button className="cool-btn secondary" onClick={() => setActiveView('attendance')}>View Detailed Logs</button>
        </div>
        
        <div className="glass-card">
          <h3>👤 Profile Status</h3>
          <p>Your profile information is 80% complete. Add a profile picture to reach 100%.</p>
          <button className="cool-btn secondary" onClick={() => setActiveView('profile')}>Complete Profile</button>
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
              <th>Course</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {attendanceMarked && (
              <tr>
                <td>{currentTime.toLocaleDateString()}</td>
                <td><span className="badge-present">PRESENT</span></td>
                <td>Current Session</td>
                <td>Self Check-in at {checkInTime}</td>
              </tr>
            )}
            {!attendanceMarked && (
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
=======
  return (
    <div className="home-container">
      <header className="navbar">
        <h1>AttendEase</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/cart">Cart</a>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>
      </header>

      <main className="content">
        <div className="welcome-section">
          <h2>Welcome, {user?.firstname}!</h2>
          <p className="subtitle">Dashboard</p>
        </div>

        <section className="dashboard-widgets">
          <div className="widget">
            <h3>Attendance</h3>
            <p>You have 0 check-ins this week.</p>
            <button className="small-btn">View Attendance</button>
          </div>
          <div className="widget">
            <h3>Profile</h3>
            <p>Manage your account details.</p>
            <button className="small-btn">Edit Profile</button>
          </div>
          <div className="widget">
            <h3>Settings</h3>
            <p>Update preferences and security.</p>
            <button className="small-btn">Go to Settings</button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 AttendEase. All rights reserved.</p>
      </footer>
>>>>>>> 22472d3ea753ec6ffce45255a8580bf00526b655
    </div>
  );
}
