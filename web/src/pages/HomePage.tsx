import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendanceService, AdminAttendanceRecord, AttendanceRecord } from '../services/attendanceService';
import { authService } from '../services/authService';
import '../styles/home.css';

type View = 'dashboard' | 'attendance' | 'profile' | 'settings';

export default function HomePage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendance, setAttendance] = useState<Array<AttendanceRecord | AdminAttendanceRecord>>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [error, setError] = useState('');

  const todayRecord = useMemo(() => {
    if (isAdmin) {
      return undefined;
    }
    const today = new Date().toISOString().slice(0, 10);
    return attendance.find((record) => record.date === today);
  }, [attendance, isAdmin]);

  const presentCount = attendance.filter((record) => record.status === 'PRESENT').length;
  const attendanceRate = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0;
  const trackedUsers = new Set(attendance.map((record) => record.userId)).size;
  const today = new Date().toISOString().slice(0, 10);
  const todayPresent = attendance.filter((record) => record.date === today && record.status === 'PRESENT').length;

  const getApiErrorMessage = (err: any, fallback: string) => {
    const data = err?.response?.data;
    if (typeof data === 'string') {
      return data;
    }
    if (typeof data?.message === 'string') {
      return data.message;
    }
    if (typeof data?.error === 'string') {
      return data.error;
    }
    if (err?.message) {
      return err.message;
    }
    return fallback;
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [isAdmin]);

  const loadAttendance = async () => {
    setLoadingAttendance(true);
    setError('');
    try {
      const records = isAdmin ? await attendanceService.getAll() : await attendanceService.getMine();
      setAttendance(records);
    } catch (err: any) {
      setError(getApiErrorMessage(err, 'Unable to load attendance records'));
    } finally {
      setLoadingAttendance(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleMarkAttendance = async () => {
    if (isAdmin) {
      return;
    }
    setSavingAttendance(true);
    setError('');
    try {
      const record = await attendanceService.checkIn();
      setAttendance((records) => {
        const exists = records.some((item) => item.id === record.id);
        return exists ? records : [record, ...records];
      });
    } catch (err: any) {
      setError(getApiErrorMessage(err, 'Unable to save attendance'));
    } finally {
      setSavingAttendance(false);
    }
  };

  const formatDate = (value: string) =>
    new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const formatTime = (value?: string) =>
    value
      ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '-';

  const getRecordName = (record: AttendanceRecord | AdminAttendanceRecord) =>
    'firstname' in record ? `${record.firstname} ${record.lastname}` : `User ${record.userId}`;

  const getRecordEmail = (record: AttendanceRecord | AdminAttendanceRecord) =>
    'email' in record ? record.email : `User ID: ${record.userId}`;

  const renderDashboard = () => (
    <div className="view-container">
      <section className="page-heading">
        <div>
          <p className="eyebrow">{isAdmin ? 'Admin console' : 'Dashboard'}</p>
          <h2>{isAdmin ? 'Admin Dashboard' : `Welcome, ${user?.firstname || 'Student'}`}</h2>
          <p className="subtitle">
            {isAdmin ? 'Monitor user attendance records and daily check-ins.' : 'Attendance, time, settings, and profile in one place.'}
          </p>
        </div>
        <div className="time-panel">
          <strong>{currentTime.toLocaleTimeString()}</strong>
          <span>{currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </section>

      {error && <div className="app-alert">{error}</div>}

      <section className="stats-row">
        <div className="stat-card">
          <span className="stat-icon">A</span>
          <div className="stat-info">
            <h4>{isAdmin ? 'Tracked Users' : 'Total Records'}</h4>
            <span className="value">{isAdmin ? trackedUsers : attendance.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">P</span>
          <div className="stat-info">
            <h4>{isAdmin ? 'Present Today' : 'Attendance Rate'}</h4>
            <span className="value">{isAdmin ? todayPresent : `${attendanceRate}%`}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">{isAdmin ? '%' : 'D'}</span>
          <div className="stat-info">
            <h4>{isAdmin ? 'Today Rate' : 'Today'}</h4>
            <span className="value">
              {isAdmin ? `${trackedUsers ? Math.round((todayPresent / trackedUsers) * 100) : 0}%` : todayRecord ? 'Present' : 'Pending'}
            </span>
          </div>
        </div>
      </section>

      {isAdmin ? (
        <section className="glass-card admin-panel">
          <div className="section-title-row">
            <div>
              <h3>Users Attendance</h3>
              <p>Latest check-ins from registered users.</p>
            </div>
            <button className="small-text-button" onClick={() => setActiveView('attendance')}>View all</button>
          </div>
          <div className="activity-list recent-list">
            {attendance.slice(0, 6).map((record) => (
              <div className="activity-item admin-activity-item" key={record.id}>
                <span className="activity-dot" />
                <div className="activity-content">
                  <div className="activity-title">{getRecordName(record)}</div>
                  <div className="activity-time">{getRecordEmail(record)} • {formatDate(record.date)} at {formatTime(record.createdAt)}</div>
                </div>
                <span className={`status-badge status-${record.status.toLowerCase()}`}>{record.status}</span>
              </div>
            ))}
            {!attendance.length && (
              <div className="empty-state">{loadingAttendance ? 'Loading user records...' : 'No attendance records yet.'}</div>
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="dashboard-grid dashboard-hub">
            <div className={`glass-card hub-card attendance-card ${todayRecord ? 'success' : ''}`}>
              <div className="hub-card-top">
                <span className="hub-icon">A</span>
                <h3>Attendance</h3>
              </div>
              <p>{todayRecord ? 'Your attendance for today is already saved.' : 'Mark your attendance for today.'}</p>
              {todayRecord ? (
                <div className="checkin-confirmation">
                  <strong>Checked in</strong>
                  <span>{formatTime(todayRecord.createdAt)}</span>
                </div>
              ) : (
                <button className="cool-btn" onClick={handleMarkAttendance} disabled={savingAttendance}>
                  {savingAttendance ? 'Saving...' : 'Mark Present'}
                </button>
              )}
              <button className="cool-btn secondary card-link" onClick={() => setActiveView('attendance')}>View Attendance</button>
            </div>

            <div className="glass-card hub-card time-card">
              <div className="hub-card-top">
                <span className="hub-icon">T</span>
                <h3>Time</h3>
              </div>
              <div className="clock-display">{currentTime.toLocaleTimeString()}</div>
              <p>{currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="glass-card hub-card profile-summary">
              <div className="hub-card-top">
                <span className="hub-icon">U</span>
                <h3>User Profile</h3>
              </div>
              <p>{user?.firstname} {user?.lastname}<br />{user?.email}</p>
              <div className="profile-pill">{user?.role || 'STUDENT'}</div>
              <button className="cool-btn secondary" onClick={() => setActiveView('profile')}>View Profile</button>
            </div>

            <div className="glass-card hub-card settings-summary">
              <div className="hub-card-top">
                <span className="hub-icon">S</span>
                <h3>Settings</h3>
              </div>
              <p>Manage reminders, dashboard clock, and display preferences.</p>
              <button className="cool-btn secondary" onClick={() => setActiveView('settings')}>Open Settings</button>
            </div>
          </section>

          <section className="glass-card recent-card">
            <div className="section-title-row">
              <h3>Recent Attendance</h3>
              <button className="small-text-button" onClick={() => setActiveView('attendance')}>View all</button>
            </div>
            <div className="activity-list recent-list">
              {attendance.slice(0, 4).map((record) => (
                <div className="activity-item" key={record.id}>
                  <span className="activity-dot" />
                  <div className="activity-content">
                    <div className="activity-title">{record.status}</div>
                    <div className="activity-time">{formatDate(record.date)} at {formatTime(record.createdAt)}</div>
                  </div>
                </div>
              ))}
              {!attendance.length && (
                <div className="empty-state">{loadingAttendance ? 'Loading records...' : 'No attendance records yet.'}</div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );

  const renderAttendance = () => (
    <div className="view-container">
      <section className="page-heading compact">
        <div>
          <p className="eyebrow">{isAdmin ? 'Admin records' : 'Database records'}</p>
          <h2>{isAdmin ? 'Users Attendance' : 'Attendance History'}</h2>
        </div>
        <button className="cool-btn refresh-btn" onClick={loadAttendance} disabled={loadingAttendance}>
          {loadingAttendance ? 'Refreshing...' : 'Refresh'}
        </button>
      </section>

      {error && <div className="app-alert">{error}</div>}

      <div className="glass-card table-card">
        <table className="cool-table">
          <thead>
            <tr>
              {isAdmin && <th>User</th>}
              <th>Date</th>
              <th>Status</th>
              <th>Saved At</th>
              <th>{isAdmin ? 'Email' : 'User ID'}</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id}>
                {isAdmin && <td>{getRecordName(record)}</td>}
                <td>{formatDate(record.date)}</td>
                <td><span className={`status-badge status-${record.status.toLowerCase()}`}>{record.status}</span></td>
                <td>{formatTime(record.createdAt)}</td>
                <td>{isAdmin ? getRecordEmail(record) : record.userId}</td>
              </tr>
            ))}
            {!attendance.length && (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="empty-cell">
                  {loadingAttendance ? 'Loading attendance records...' : 'No attendance records found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="view-container">
      <section className="page-heading compact">
        <div>
          <p className="eyebrow">User table</p>
          <h2>User Profile</h2>
        </div>
      </section>
      <div className="glass-card profile-card">
        <div className="profile-header">
          <div className="avatar-circle large">{user?.firstname?.[0] || 'U'}</div>
          <div>
            <h3>{user?.firstname} {user?.lastname}</h3>
            <p>{user?.role || 'STUDENT'}</p>
          </div>
        </div>
        <div className="profile-grid">
          <label>
            <span>First Name</span>
            <input type="text" className="cool-input" defaultValue={user?.firstname} readOnly />
          </label>
          <label>
            <span>Last Name</span>
            <input type="text" className="cool-input" defaultValue={user?.lastname} readOnly />
          </label>
          <label className="wide-field">
            <span>Email Address</span>
            <input type="email" className="cool-input" defaultValue={user?.email} readOnly />
          </label>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="view-container">
      <section className="page-heading compact">
        <div>
          <p className="eyebrow">Preferences</p>
          <h2>Settings</h2>
        </div>
      </section>
      <div className="glass-card settings-card">
        <label className="setting-row">
          <span>Email reminders</span>
          <input type="checkbox" defaultChecked />
        </label>
        <label className="setting-row">
          <span>Dashboard clock</span>
          <input type="checkbox" defaultChecked />
        </label>
        <label className="setting-row">
          <span>Compact history table</span>
          <input type="checkbox" />
        </label>
      </div>
    </div>
  );

  return (
    <div className="home-container">
      <aside className="sidebar">
        <div className="logo-area">
          <h1>AttendEase</h1>
          <span>laspinas_db</span>
        </div>

        <nav className="nav-links">
          <button className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}>
            {isAdmin ? 'Admin' : 'Dashboard'}
          </button>
          <button className={`nav-item ${activeView === 'attendance' ? 'active' : ''}`} onClick={() => setActiveView('attendance')}>
            {isAdmin ? 'Users Attendance' : 'Attendance'}
          </button>
          <button className={`nav-item ${activeView === 'profile' ? 'active' : ''}`} onClick={() => setActiveView('profile')}>
            Profile
          </button>
          <button className={`nav-item ${activeView === 'settings' ? 'active' : ''}`} onClick={() => setActiveView('settings')}>
            Settings
          </button>
          <button onClick={handleLogout} className="nav-item logout-nav-item">
            Logout
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header-top">
          <div className="connection-status">
            <span />
            MySQL 127.0.0.1:3307
          </div>
          <div className="user-badge">
            <strong>{isAdmin ? 'Admin' : user?.firstname || 'User'}</strong>
            <div className="avatar-circle">{user?.firstname?.[0] || 'U'}</div>
          </div>
        </header>

        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'attendance' && renderAttendance()}
        {activeView === 'profile' && renderProfile()}
        {activeView === 'settings' && renderSettings()}
      </main>
    </div>
  );
}
