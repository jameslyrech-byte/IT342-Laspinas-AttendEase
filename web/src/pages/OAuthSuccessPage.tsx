import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const firstname = searchParams.get('firstname');
    const lastname = searchParams.get('lastname');
    const role = searchParams.get('role');

    if (!token || !id || !email || !firstname || !lastname || !role) {
      navigate('/login');
      return;
    }

    authService.loginWithToken(token, {
      id: Number(id),
      email,
      firstname,
      lastname,
      role,
    });

    navigate('/');
  }, [navigate, searchParams]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Signing in with Google...</h2>
      </div>
    </div>
  );
}
