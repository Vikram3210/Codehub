// src/pages/quiz/QuizSettings.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/useAuth';
import { quizApi } from '../../utils/quiz/api';
import './QuizSettings.css';

const QuizSettings = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    theme: 'dark',
    language: 'en',
    autoStart: false,
    defaultTimeLimit: 20,
    defaultQuestions: 10,
    defaultDomain: 'Mixed'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const username = currentUser?.displayName || currentUser?.email || 'Player';
    try {
      const data = await quizApi.get(`/settings/${encodeURIComponent(username)}`);
      setSettings(prev => ({ ...prev, ...data }));
      setLoading(false);
      applyTheme(data.theme || 'dark');
    } catch (err) {
      console.error('Error loading settings:', err);
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    const username = currentUser?.displayName || currentUser?.email || 'Player';
    try {
      await quizApi.put('/settings', { username, settings });
      setMessage('Settings saved successfully!');
      setSaving(false);
      applyTheme(settings.theme);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setMessage('Failed to save settings');
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const resetToDefaults = () => {
    setSettings({
      notifications: true,
      soundEffects: true,
      theme: 'dark',
      language: 'en',
      autoStart: false,
      defaultTimeLimit: 20,
      defaultQuestions: 10,
      defaultDomain: 'Mixed'
    });
  };

  const applyTheme = (theme) => {
    document.body.setAttribute('data-theme', theme);
  };

  const onThemeChange = () => {
    applyTheme(settings.theme);
    saveSettings();
  };

  const currentUsername = currentUser?.displayName || currentUser?.email || 'Player';

  return (
    <div className="settings-page">
      <header>
        <div className="brand">QUIZ <span>SETTINGS</span></div>
        <div className="spacer"></div>
        <div className="user">👤 {currentUsername}</div>
        <button className="logout" onClick={() => navigate('/quiz/dashboard')}>Back to Dashboard</button>
      </header>

      <main>
        <div className="settings-container">
          <div className="settings-header">
            <h1>⚙️ Settings</h1>
            <p>Customize your quiz experience and preferences</p>
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading settings...</p>
            </div>
          )}

          {!loading && (
            <div className="settings-content">
              {message && (
                <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

              <div className="settings-section">
                <h2>🎮 General Settings</h2>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Notifications</h3>
                    <p>Receive notifications for quiz updates and results</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Sound Effects</h3>
                    <p>Play sound effects during quiz gameplay</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.soundEffects}
                      onChange={(e) => setSettings(prev => ({ ...prev, soundEffects: e.target.checked }))}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Auto Start</h3>
                    <p>Automatically start quiz when all players join</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.autoStart}
                      onChange={(e) => setSettings(prev => ({ ...prev, autoStart: e.target.checked }))}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h2>🎨 Appearance</h2>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Theme</h3>
                    <p>Choose your preferred color theme</p>
                  </div>
                  <select
                    value={settings.theme}
                    onChange={(e) => {
                      setSettings(prev => ({ ...prev, theme: e.target.value }));
                      onThemeChange();
                    }}
                    className="setting-select"
                  >
                    <option value="dark">Dark Theme</option>
                    <option value="light">Light Theme</option>
                    <option value="neon">Neon Theme</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Language</h3>
                    <p>Select your preferred language</p>
                  </div>
                  <select
                    value={settings.language}
                    onChange={(e) => {
                      setSettings(prev => ({ ...prev, language: e.target.value }));
                      saveSettings();
                    }}
                    className="setting-select"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h2>🎯 Quiz Defaults</h2>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Default Time Limit</h3>
                    <p>Default time per question (in seconds)</p>
                  </div>
                  <input
                    type="number"
                    value={settings.defaultTimeLimit}
                    onChange={(e) => setSettings(prev => ({ ...prev, defaultTimeLimit: Number(e.target.value) }))}
                    min="10"
                    max="120"
                    className="setting-input"
                  />
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Default Questions</h3>
                    <p>Default number of questions per quiz</p>
                  </div>
                  <input
                    type="number"
                    value={settings.defaultQuestions}
                    onChange={(e) => setSettings(prev => ({ ...prev, defaultQuestions: Number(e.target.value) }))}
                    min="5"
                    max="50"
                    className="setting-input"
                  />
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Default Domain</h3>
                    <p>Default question category</p>
                  </div>
                  <select
                    value={settings.defaultDomain}
                    onChange={(e) => setSettings(prev => ({ ...prev, defaultDomain: e.target.value }))}
                    className="setting-select"
                  >
                    <option value="Mixed">Mixed</option>
                    <option value="Verbal">Verbal</option>
                    <option value="Logical">Logical</option>
                    <option value="Quant">Quantitative Aptitude</option>
                  </select>
                </div>
              </div>

              <div className="settings-actions">
                <button className="save-btn" onClick={saveSettings} disabled={saving}>
                  {saving ? 'Saving...' : '💾 Save Settings'}
                </button>
                <button className="reset-btn" onClick={resetToDefaults} disabled={saving}>
                  🔄 Reset to Defaults
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizSettings;


