import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../state/useAuth';
import { logout } from '../services/firebase';

export default function PracticeHeader() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const userName = useMemo(
    () =>
      currentUser?.displayName ||
      currentUser?.email?.split('@')[0] ||
      'Coder',
    [currentUser]
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
      {/* Left: profile pill, clickable to /profile */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/profile')}
        className="btn btn-outline-light d-flex align-items-center gap-2 px-3 py-2"
        style={{ borderRadius: '999px' }}
      >
        <span
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light text-dark"
          style={{ width: 28, height: 28, fontWeight: 600 }}
        >
          {userName?.charAt(0)?.toUpperCase() || 'U'}
        </span>
        <span className="fw-semibold" style={{ fontSize: '0.95rem' }}>
          {userName}
        </span>
      </motion.button>

      {/* Right: Leaderboard, Back to Practice, Logout */}
      <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto flex-wrap">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/leaderboard')}
          className="btn btn-outline-info"
          title="View Leaderboard"
          style={{ whiteSpace: 'nowrap' }}
        >
          🏆 Leaderboard
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/practice')}
          className="btn btn-outline-light"
          title="Back to Practice"
          style={{ whiteSpace: 'nowrap' }}
        >
          ← Back to Practice
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="btn btn-logout"
          title="Logout"
          style={{ whiteSpace: 'nowrap' }}
        >
          🚪 Logout
        </motion.button>
      </div>
    </div>
  );
}

