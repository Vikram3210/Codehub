// src/pages/Login.jsx (CRITICAL FIX: Removed double navigation)
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContainer from '../components/AuthContainer';
import { login, signInWithGoogle } from '../services/firebase';
import { useAuth } from '../state/useAuth';
import googleLogo from '/images/google_logo.png'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const { currentUser, loading } = useAuth(); // CRITICAL: Get loading state

  // 1. useEffect: This handles redirection AFTER authentication is complete
  useEffect(() => {
    // If NOT loading and we have a user, navigate to practice center
    if (!loading && currentUser) { 
      navigate('/practice', { replace: true });
    }
    // Note: Do NOT add 'loading' to the dependency array if it causes a loop, 
    // but typically it is required. Keep it for now.
  }, [currentUser, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      // CRITICAL FIX: REMOVE MANUAL REDIRECT HERE. 
      // The useEffect above will handle navigation when currentUser updates.
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // CRITICAL FIX: REMOVE MANUAL REDIRECT HERE. 
      // The useEffect above will handle navigation when currentUser updates.
    } catch (err) {
      setError(err.message || 'Google Sign-In failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return null; // Prevent UI flash during initial check

  // ... (render JSX remains the same)
  return (
    <AuthContainer title="Sign In" subtitle="Welcome back to the hub.">
      {/* ... (rest of the Login JSX) */}
      {error && <div className="alert alert-danger mb-4 py-2" style={{ backgroundColor: '#ff333330', borderColor: '#ff3333' }}>{error}</div>}
      
      <form onSubmit={handleLogin} className="mb-4">
        {/* ... (email and password inputs) */}
        <div className="mb-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control form-control-custom py-2"
            placeholder="Email"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control form-control-custom py-2"
            placeholder="Password"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-neon w-100 mb-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            '🚀 LOGIN'
          )}
        </button>
      </form>

      <div className="text-center mb-3">
        <span className="text-light-50">Don't have an account? </span>
        <Link
          to="/register"
          className="text-decoration-none"
          style={{ color: 'var(--color-accent-cyan)' }}
        >
          SIGN UP
        </Link>
      </div>

      <div className="d-flex align-items-center my-3">
        <hr className="flex-grow-1 border-light-50" />
        <span className="text-light-50 mx-3" style={{ fontSize: '0.8rem' }}>OR</span>
        <hr className="flex-grow-1 border-light-50" />
      </div>

      <button
        onClick={handleGoogleLogin}
        className="btn btn-google-custom w-100 d-flex align-items-center justify-content-center py-2"
        disabled={isLoading}
      >
        <img src={googleLogo} alt="Google" height="20" className="me-2" />
        CONTINUE WITH GOOGLE
      </button>
    </AuthContainer>
  );
}