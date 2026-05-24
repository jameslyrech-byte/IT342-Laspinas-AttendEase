import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
<<<<<<< HEAD
import OAuthSuccessPage from './pages/OAuthSuccessPage';
=======
>>>>>>> 22472d3ea753ec6ffce45255a8580bf00526b655
import './App.css';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return authService.isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
<<<<<<< HEAD
        <Route path="/oauth-success" element={<OAuthSuccessPage />} />
=======
>>>>>>> 22472d3ea753ec6ffce45255a8580bf00526b655
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
