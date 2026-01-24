// src/pages/quiz/QuizProfile.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/useAuth';
import { quizApi } from '../../utils/quiz/api';
import { updateProfile } from 'firebase/auth';
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
    const username = currentUser?.displayName || currentUser?.email || 'Player';
    try {
      const data = await quizApi.get(`/profile/${encodeURIComponent(username)}`);
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
                    <h3>{profile.rank || 'N/A'}</h3>
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
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizProfile;


