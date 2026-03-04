import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../components/AuthContainer';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage('Password reset link sent to your email.');
    } catch (err) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Failed to send reset link.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer title="Forgot Password" subtitle="Enter your email to receive a reset link.">
      {message && (
        <div className="alert alert-success mb-3 py-2">
          {message}
        </div>
      )}
      {error && (
        <div
          className="alert alert-danger mb-3 py-2"
          style={{ backgroundColor: '#ff333330', borderColor: '#ff3333' }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3 text-start">
          <label className="form-label text-light">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control form-control-custom py-2"
            placeholder="Enter your registered email"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-neon w-100 mb-3"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <div className="text-center">
          <button
            type="button"
            className="btn btn-outline-light px-4 py-2"
            onClick={() => navigate('/login')}
          >
            ← Back to Login
          </button>
        </div>
      </form>
    </AuthContainer>
  );
}

