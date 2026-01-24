import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import './Profile.css';

const Profile = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const currentUsername = auth.currentUser?.displayName || auth.currentUser?.email || '';
    setNewUsername(currentUsername);
    loadProfile();
  }, [auth.currentUser]);

  const loadProfile = async () => {
    setLoading(true);
    const username = auth.currentUser?.displayName || auth.currentUser?.email || 'Player';
    try {
      const data = await api.get(`/profile/${encodeURIComponent(username)}`);
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
    const currentUsername = auth.currentUser?.displayName || auth.currentUser?.email || 'Player';
    try {
      await auth.updateDisplayName(newUsername.trim());
      await api.put('/profile/username', { currentUsername, newUsername: newUsername.trim() });
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

  const savePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('All password fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }
    setSaving(true);
    try {
      await auth.changePassword(currentPassword, newPassword);
      setMessage('Password updated successfully!');
      setChangingPassword(false);
      setSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating password:', err);
      setMessage(err?.message || 'Failed to update password');
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

  const currentUsername = auth.currentUser?.displayName || auth.currentUser?.email || 'Player';

  return (
    <div className="profile-page">
      <header>
        <div className="brand">APTITUDE <span>ARENA</span></div>
        <div className="spacer"></div>
        <div className="user">👤 {currentUsername}</div>
        <button className="logout" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
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
                    <h3>{profile.totalScore}</h3>
                    <p>Total Score</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎮</div>
                  <div className="stat-info">
                    <h3>{profile.gamesPlayed}</h3>
                    <p>Games Played</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <h3>{profile.averageScore}</h3>
                    <p>Average Score</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">{getRankIcon(profile.rank)}</div>
                  <div className="stat-info">
                    <h3>{profile.rank}</h3>
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
                        setNewUsername(profile.username);
                      }}>Edit</button>
                    )}
                  </div>
                  {!editingUsername ? (
                    <div className="setting-display">
                      <span className="current-value">{profile.username}</span>
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
                          setNewUsername(profile.username);
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
                    <span className="current-value">{profile.email}</span>
                    <span className="readonly-note">(Cannot be changed)</span>
                  </div>
                </div>

                <div className="setting-group">
                  <div className="setting-header">
                    <h3>Password</h3>
                    {!changingPassword && (
                      <button className="edit-btn" onClick={() => {
                        setChangingPassword(true);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                        setMessage('');
                      }}>Change</button>
                    )}
                  </div>
                  {!changingPassword ? (
                    <div className="setting-display">
                      <span className="current-value">••••••••</span>
                    </div>
                  ) : (
                    <div className="setting-edit">
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current password"
                        className="form-input"
                      />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                        className="form-input"
                      />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="form-input"
                      />
                      <div className="edit-actions">
                        <button className="save-btn" onClick={savePassword} disabled={saving}>
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button className="cancel-btn" onClick={() => {
                          setChangingPassword(false);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setMessage('');
                        }} disabled={saving}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="setting-group">
                  <div className="setting-header">
                    <h3>Account Information</h3>
                  </div>
                  <div className="account-info">
                    <div className="info-item">
                      <span className="info-label">Member since:</span>
                      <span className="info-value">{new Date(profile.joinDate).toLocaleDateString()}</span>
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

export default Profile;



