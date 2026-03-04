import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../state/useAuth';
import { auth } from '../services/firebase';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, updateProfile as fbUpdateProfile } from 'firebase/auth';
import { quizApi } from '../utils/quiz/api';
import PracticeHeader from '../components/PracticeHeader.jsx';

export default function Profile() {
  const { state } = useApp();
  const { currentUser } = useAuth();
  const [profileMessage, setProfileMessage] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  const email = currentUser?.email || 'N/A';
  const displayName =
    currentUser?.displayName ||
    email.split('@')[0] ||
    state.profile?.name ||
    'Coder';

  const totalXP = useMemo(
    () => Object.values(state.xpByLanguage || {}).reduce((sum, v) => sum + (Number(v) || 0), 0),
    [state.xpByLanguage]
  );

  const levelsCompleted = useMemo(
    () =>
      Object.values(state.levelsByLanguage || {}).reduce(
        (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
        0
      ),
    [state.levelsByLanguage]
  );

  const passwordProvider = currentUser?.providerData?.some(
    (p) => p.providerId === 'password'
  );
  const isGoogleProvider = currentUser?.providerData?.some(
    (p) => p.providerId === 'google.com'
  );

  useEffect(() => {
    const loadLanguageProgress = async () => {
      try {
        setLoadingLangProgress(true);
        const languages = await quizApi.get('/languages');

        const langsArray =
          Array.isArray(languages) && languages.length > 0
            ? languages
            : [];

        const progressEntries = await Promise.all(
          langsArray.map(async (lang) => {
            try {
              const lessons = await quizApi.get(`/lessons?languageKey=${encodeURIComponent(lang.key)}`);
              const completedIds = new Set(
                Array.isArray(state.levelsByLanguage?.[lang.key])
                  ? state.levelsByLanguage[lang.key]
                  : []
              );

              const counters = lessons.reduce(
                (acc, lesson) => {
                  const difficulty = lesson.difficulty || 'intermediate';
                  const isCompleted = completedIds.has(lesson._id) || completedIds.has(lesson.id);

                  if (difficulty === 'easy') {
                    acc.easyTotal += 1;
                    if (isCompleted) acc.easyCompleted += 1;
                  } else if (difficulty === 'advanced') {
                    acc.advancedTotal += 1;
                    if (isCompleted) acc.advancedCompleted += 1;
                  } else {
                    acc.intermediateTotal += 1;
                    if (isCompleted) acc.intermediateCompleted += 1;
                  }

                  return acc;
                },
                {
                  easyCompleted: 0,
                  easyTotal: 0,
                  intermediateCompleted: 0,
                  intermediateTotal: 0,
                  advancedCompleted: 0,
                  advancedTotal: 0,
                }
              );

              const xp = Number(state.xpByLanguage?.[lang.key] || 0);

              return {
                key: lang.key,
                name: lang.name,
                xp,
                ...counters,
              };
            } catch (err) {
              console.error('Failed to load lessons for language', lang.key, err);
              return null;
            }
          })
        );

        setLanguageProgress(progressEntries.filter(Boolean));
      } catch (err) {
        console.error('Failed to load language progress', err);
        setLanguageProgress([]);
      } finally {
        setLoadingLangProgress(false);
      }
    };

    loadLanguageProgress();
  }, [state.levelsByLanguage, state.xpByLanguage]);

  const [languageProgress, setLanguageProgress] = useState([]);
  const [loadingLangProgress, setLoadingLangProgress] = useState(false);

  const handleSaveName = async () => {
    if (!newName.trim()) {
      setProfileMessage('Name cannot be empty.');
      return;
    }
    if (!currentUser) return;
    const currentUsername = currentUser.displayName || currentUser.email || 'Player';
    try {
      // Update quiz/profile DB username
      await quizApi.put('/profile/username', {
        currentUsername,
        newUsername: newName.trim(),
      });
      // For non-Google accounts, also update Firebase displayName
      if (!isGoogleProvider && auth.currentUser) {
        await fbUpdateProfile(auth.currentUser, { displayName: newName.trim() });
      }
      setProfileMessage('Name updated successfully.');
      setEditingName(false);
      setTimeout(() => setProfileMessage(''), 3000);
    } catch (e) {
      console.error('Error updating name:', e);
      setProfileMessage(e?.message || 'Failed to update name.');
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (!passwordProvider) return;
    const form = event.currentTarget;
    const current = form.currentPassword.value;
    const next = form.newPassword.value;
    const confirm = form.confirmPassword.value;

    if (!current || !next || !confirm) {
      alert('Please fill all password fields.');
      return;
    }
    if (next !== confirm) {
      alert('New password and confirmation do not match.');
      return;
    }
    if (next.length < 6) {
      alert('New password should be at least 6 characters.');
      return;
    }
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        alert('Unable to update password. Please re-login.');
        return;
      }
      const cred = EmailAuthProvider.credential(user.email, current);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, next);
      form.reset();
      alert('Password updated successfully.');
    } catch (err) {
      console.error('Change password error:', err);
      alert(err?.message || 'Failed to change password.');
    }
  };

  return (
    <div className="gradient-bg" style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container py-5">
        <PracticeHeader />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glow p-4 p-md-5 mx-auto"
          style={{ maxWidth: '900px', backgroundColor: '#151a2d', borderRadius: '18px' }}
        >
          {profileMessage && (
            <p className="text-info text-center mb-3">{profileMessage}</p>
          )}

          <div className="row g-4 mb-4">
            <div className="col-12 col-md-6">
              <div className="p-3 rounded-3" style={{ backgroundColor: '#1a2038' }}>
                <h5 className="text-light mb-2">Account</h5>
                {!editingName ? (
                  <p className="mb-1 text-light d-flex align-items-center justify-content-between">
                    <span>
                      <strong>Name:</strong> {displayName}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-info ms-2"
                      onClick={() => {
                        setNewName(displayName);
                        setEditingName(true);
                      }}
                    >
                      Edit
                    </button>
                  </p>
                ) : (
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      style={{ maxWidth: 260 }}
                    />
                    <button
                      type="button"
                      className="btn btn-neon btn-sm"
                      onClick={handleSaveName}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-light btn-sm"
                      onClick={() => setEditingName(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <p className="mb-0 text-light">
                  <strong>Email:</strong> {email}
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="p-3 rounded-3" style={{ backgroundColor: '#1a2038' }}>
                <h5 className="text-light mb-2">Learning Progress</h5>
                <p className="mb-1 text-light">
                  <strong>Language Selected:</strong> {state.selectedLanguage}
                </p>
                <p className="mb-1 text-light">
                  <strong>Total XP:</strong> {totalXP}
                </p>
                <p className="mb-0 text-light">
                  <strong>Levels completed:</strong> {levelsCompleted}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-light mb-3">Language Progress</h3>
            {loadingLangProgress ? (
              <p className="text-light-50 mb-4">Loading language progress...</p>
            ) : languageProgress.length === 0 ? (
              <p className="text-light-50 mb-4">
                Start completing lessons to see detailed language progress here.
              </p>
            ) : (
              <div className="row g-3 mb-4">
                {languageProgress.map((lang) => (
                  <div key={lang.key} className="col-12 col-md-6">
                    <div
                      className="p-3 rounded-3 h-100"
                      style={{ backgroundColor: '#1a2038' }}
                    >
                      <h5 className="text-light mb-2">{lang.name}</h5>
                      <p className="mb-2 text-light">
                        <strong>XP:</strong> {lang.xp}
                      </p>
                      <p className="mb-1 text-light-50 small">
                        Easy Levels Completed:{' '}
                        <span className="text-light">
                          {lang.easyCompleted}/{lang.easyTotal || 0}
                        </span>
                      </p>
                      <p className="mb-1 text-light-50 small">
                        Intermediate Levels Completed:{' '}
                        <span className="text-light">
                          {lang.intermediateCompleted}/{lang.intermediateTotal || 0}
                        </span>
                      </p>
                      <p className="mb-0 text-light-50 small">
                        Advanced Levels Completed:{' '}
                        <span className="text-light">
                          {lang.advancedCompleted}/{lang.advancedTotal || 0}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h3 className="text-light mb-3">Change Password</h3>
            {!passwordProvider ? (
              <p className="text-light-50 mb-0">
                Password is managed by your Google account. Please change it from your Google
                account security settings.
              </p>
            ) : (
              <form onSubmit={handleChangePassword} className="row g-3">
                <div className="col-12 col-md-4">
                  <label className="form-label text-light">Current password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    className="form-control form-control-custom"
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label text-light">New password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="form-control form-control-custom"
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label text-light">Confirm password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control form-control-custom"
                  />
                </div>
                <div className="col-12 mt-2">
                  <button type="submit" className="btn btn-neon px-4 py-2">
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

