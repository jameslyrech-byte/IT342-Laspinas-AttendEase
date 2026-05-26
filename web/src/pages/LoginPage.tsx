import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { authService, LoginData } from '../services/authService';
import '../styles/auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  React.useEffect(() => {
    const oauthError = searchParams.get('oauthError');
    if (oauthError) {
      setError(oauthError);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login({ email, password } as LoginData);
      navigate('/');
    } catch (err: any) {
      const message = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message;
      setError(message || 'Login failed. Please check your email, password, and backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <p className="auth-subtitle">Sign in to manage your attendance.</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <button
          type="button"
          className="oauth-button"
          onClick={() => window.location.href = 'http://localhost:8080/api/v1/oauth2/authorization/google'}
        >
          Continue with Google
        </button>
        <p className="auth-footer">
          Don't have an account? <Link className="auth-link" to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
