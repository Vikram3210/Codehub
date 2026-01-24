import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Auth = () => {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const clearMsg = () => {
    setMessage('');
    setIsError(false);
  };

  const fail = (msg) => {
    setMessage(msg);
    setIsError(true);
  };

  const onLogin = async () => {
    clearMsg();
    try {
      await auth.login(email.trim(), password);
      setMessage('Welcome back! Redirecting…');
      setIsError(false);
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (e) {
      fail(e?.message || 'Login failed');
    }
  };

  const onRegister = async () => {
    clearMsg();
    if (password !== confirm) {
      return fail('Passwords do not match');
    }
    try {
      await auth.register(email.trim(), password);
      setMessage('Account created! You are logged in.');
      setIsError(false);
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (e) {
      fail(e?.message || 'Registration failed');
    }
  };

  const onGoogle = async () => {
    clearMsg();
    try {
      await auth.googleSignIn();
      setMessage('Signed in with Google!');
      setIsError(false);
      setTimeout(() => navigate('/dashboard'), 400);
    } catch (e) {
      fail(e?.message || 'Google sign-in failed');
    }
  };

  return (
    <div className="auth-wrap">
      <div className="bg-anim"></div>

      <div className="card">
        <div className="title">Enter the <span>Arena</span></div>

        <div className="tabs">
          <button
            className={tab === 'login' ? 'active' : ''}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            className={tab === 'register' ? 'active' : ''}
            onClick={() => setTab('register')}
          >
            Register
          </button>
        </div>

        {tab === 'login' && (
          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="form">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="primary">Login</button>
          </form>
        )}

        {tab === 'register' && (
          <form onSubmit={(e) => { e.preventDefault(); onRegister(); }} className="form">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button type="submit" className="primary">Create Account</button>
          </form>
        )}

        <div className="divider"><span>or</span></div>

        <button className="google" onClick={onGoogle}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" />
          Continue with Google
        </button>

        {message && (
          <p className={`msg ${isError ? 'error' : 'ok'}`}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default Auth;



