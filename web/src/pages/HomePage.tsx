import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/home.css';

export default function HomePage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

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
    </div>
  );
}
