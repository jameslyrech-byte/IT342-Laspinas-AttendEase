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
          <p className="subtitle">E-Commerce Shopping Experience</p>
        </div>

        <section className="features">
          <h3>Featured Services</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <h4>Browse Products</h4>
              <p>Explore our wide range of products</p>
              <button>View Products</button>
            </div>
            <div className="feature-card">
              <h4>Shopping Cart</h4>
              <p>Manage your items and checkout</p>
              <button>Go to Cart</button>
            </div>
            <div className="feature-card">
              <h4>Order History</h4>
              <p>Track your orders and status</p>
              <button>View Orders</button>
            </div>
            <div className="feature-card">
              <h4>Account Settings</h4>
              <p>Update your profile information</p>
              <button>Settings</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 AttendEase. All rights reserved.</p>
      </footer>
    </div>
  );
}
