// src/pages/quiz/QuizProfile.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/useAuth';
import { quizApi } from '../../utils/quiz/api';
import { updateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import './QuizProfile.css';

const QuizProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const currentUsername = currentUser?.displayName || currentUser?.email || '';
    setNewUsername(currentUsername);
    loadProfile();
  }, [currentUser]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const candidates = [
        currentUser?.displayName,
        currentUser?.email,
        currentUser?.uid,
      ]
        .filter(Boolean)
        .map((v) => String(v).trim())
        .filter(Boolean);

      let data = null;

      for (const candidate of candidates) {
        try {
          const resp = await quizApi.get(`/profile/${encodeURIComponent(candidate)}`);
          if (resp && typeof resp === 'object') {
            data = resp;
            // If this candidate actually matches stored scores, stop early.
            if ((resp.gamesPlayed ?? 0) > 0 || (resp.totalScore ?? 0) > 0) {
              break;
            }
          }
        } catch (innerErr) {
          // keep trying other candidates
          console.warn('Profile lookup failed for', candidate, innerErr);
        }
      }

      // Fallback: derive from leaderboard if profile lookup didn't match userId exactly.
      if (!data || ((data.gamesPlayed ?? 0) === 0 && (data.totalScore ?? 0) === 0)) {
        try {
          const lb = await quizApi.get('/leaderboard');
          const normalize = (s) =>
            String(s || '')
              .toLowerCase()
              .replace(/\s+/g, ' ')
              .trim();

          const normalizedCandidates = new Set(candidates.map(normalize));
          const found = Array.isArray(lb)
            ? lb.find((row) => normalizedCandidates.has(normalize(row.username || row._id)))
            : null;

          if (found) {
            data = {
              username: found.username || found._id,
              totalScore: found.totalScore ?? 0,
              gamesPlayed: found.gamesPlayed ?? 0,
              averageScore: found.averageScore ?? 0,
              rank: found.rank ?? 0,
            };
          }
        } catch (lbErr) {
          console.warn('Leaderboard fallback failed:', lbErr);
        }
      }

      setProfile(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const saveUsername = async () => {
    if (!newUsername.trim()) {
      setMessage('Username cannot be empty');
      return;
    }
    setSaving(true);
    const currentUsername = currentUser?.displayName || currentUser?.email || 'Player';
    try {
      // Update Firebase display name
      if (currentUser) {
        await updateProfile(auth.currentUser, { displayName: newUsername.trim() });
      }
      // Update quiz database username
      await quizApi.put('/profile/username', { currentUsername, newUsername: newUsername.trim() });
      setMessage('Username updated successfully!');
      setEditingUsername(false);
      setSaving(false);
      loadProfile();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating username:', err);
      setMessage(err?.message || 'Failed to update username');
      setSaving(false);
    }
  };

  const getRankIcon = (rank) => {
    if (!rank || rank <= 0) return 'N/A';
    if (rank <= 3) {
      switch (rank) {
        case 1: return '🥇';
        case 2: return '🥈';
        case 3: return '🥉';
      }
    }
    return `#${rank}`;
  };

  const currentUsername = currentUser?.displayName || currentUser?.email || 'Player';

  const isPasswordProvider = currentUser?.providerData?.some(
    (p) => p.providerId === 'password'
  );

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (!isPasswordProvider) return;
    const form = event.currentTarget;
    const current = form.currentPassword.value;
    const next = form.newPassword.value;
    const confirm = form.confirmPassword.value;

    if (!current || !next || !confirm) {
      setMessage('Please fill all password fields.');
      return;
    }
    if (next !== confirm) {
      setMessage('New password and confirmation do not match.');
      return;
    }
    if (next.length < 6) {
      setMessage('New password should be at least 6 characters.');
      return;
    }

    try {
      if (!auth.currentUser || !auth.currentUser.email) {
        setMessage('Unable to change password. Please re-login.');
        return;
      }
      const cred = EmailAuthProvider.credential(auth.currentUser.email, current);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await updatePassword(auth.currentUser, next);
      form.reset();
      setMessage('Password updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error changing password:', err);
      setMessage(err?.message || 'Failed to change password');
    }
  };

  return (
    <div className="profile-page">
      <header>
        <div className="brand">QUIZ <span>PROFILE</span></div>
        <div className="spacer"></div>
        <div className="user">👤 {currentUsername}</div>
        <button className="logout" onClick={() => navigate('/quiz/dashboard')}>Back to Dashboard</button>
      </header>

      <main>
        <div className="profile-container">
          <div className="profile-header">
            <h1>👤 My Profile</h1>
            <p>Manage your account settings and view your progress</p>
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading profile...</p>
            </div>
          )}

          {error && (
            <div className="error">
              <p>❌ {error}</p>
              <button onClick={loadProfile}>Try Again</button>
            </div>
          )}

          {!loading && !error && profile && (
            <div className="profile-content">
              <div className="stats-section">
                <div className="stat-card">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-info">
                    <h3>{profile.totalScore || 0}</h3>
                    <p>Total Score</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎮</div>
                  <div className="stat-info">
                    <h3>{profile.gamesPlayed || 0}</h3>
                    <p>Games Played</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <h3>{profile.averageScore || 0}</h3>
                    <p>Average Score</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">{getRankIcon(profile.rank || 0)}</div>
                  <div className="stat-info">
                    <h3>{profile.rank && profile.rank > 0 ? profile.rank : 'N/A'}</h3>
                    <p>Global Rank</p>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h2>Account Settings</h2>

                {message && (
                  <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}

                <div className="setting-group">
                  <div className="setting-header">
                    <h3>Username</h3>
                    {!editingUsername && (
                      <button className="edit-btn" onClick={() => {
                        setEditingUsername(true);
                        setNewUsername(profile.username || currentUsername);
                      }}>Edit</button>
                    )}
                  </div>
                  {!editingUsername ? (
                    <div className="setting-display">
                      <span className="current-value">{profile.username || currentUsername}</span>
                    </div>
                  ) : (
                    <div className="setting-edit">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Enter new username"
                        className="form-input"
                      />
                      <div className="edit-actions">
                        <button className="save-btn" onClick={saveUsername} disabled={saving}>
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button className="cancel-btn" onClick={() => {
                          setEditingUsername(false);
                          setNewUsername(profile.username || currentUsername);
                          setMessage('');
                        }} disabled={saving}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="setting-group">
                  <div className="setting-header">
                    <h3>Email</h3>
                  </div>
                  <div className="setting-display">
                    <span className="current-value">{profile.email || currentUser?.email || 'N/A'}</span>
                    <span className="readonly-note">(Cannot be changed)</span>
                  </div>
                </div>

                <div className="setting-group">
                  <div className="setting-header">
                    <h3>Account Information</h3>
                  </div>
                  <div className="account-info">
                    <div className="info-item">
                      <span className="info-label">Member since:</span>
                      <span className="info-value">{profile.joinDate ? new Date(profile.joinDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="setting-group">
                  <div className="setting-header">
                    <h3>Change Password</h3>
                  </div>
                  {!isPasswordProvider ? (
                    <div className="setting-display">
                      <span className="readonly-note">
                        Password is managed by your Google account. Change it from your Google security settings.
                      </span>
                    </div>
                  ) : (
                    <form className="password-form" onSubmit={handleChangePassword}>
                      <div className="password-row">
                        <input
                          type="password"
                          name="currentPassword"
                          placeholder="Current password"
                          className="form-input"
                        />
                        <input
                          type="password"
                          name="newPassword"
                          placeholder="New password"
                          className="form-input"
                        />
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm password"
                          className="form-input"
                        />
                      </div>
                      <button type="submit" className="save-btn">
                        Update Password
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizProfile;


