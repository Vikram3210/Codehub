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
      setSettings(prev => ({
        ...prev,
        defaultTimeLimit: Number(data.defaultTimeLimit || prev.defaultTimeLimit),
        defaultQuestions: Number(data.defaultQuestions || prev.defaultQuestions),
        defaultDomain: data.defaultDomain || prev.defaultDomain
      }));
      setLoading(false);
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
      defaultTimeLimit: 20,
      defaultQuestions: 10,
      defaultDomain: 'Mixed'
    });
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
            <h1>⚙️ Quiz Defaults</h1>
            <p>Configure default time limit, question count, and domain for your rooms.</p>
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


