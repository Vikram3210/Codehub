import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../state/useAuth';
import { logout } from '../services/firebase';
import ProfileMenu from './ProfileMenu.jsx';

export default function PageHeader({ title, backTo = '/languages', backLabel = '← Back to Languages' }) {
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
      navigate('/login', { replace: true });
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(backTo)}
        className="btn btn-outline-light"
        title={backLabel.replace('← ', '')}
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{ whiteSpace: 'nowrap' }}
      >
        {backLabel}
      </motion.button>

      <motion.h1
        className="neon-text fw-bold mb-0 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {title}
      </motion.h1>

      <div className="d-flex align-items-center gap-2 ms-auto flex-wrap">
        <span className="text-light-50 small" style={{ whiteSpace: 'nowrap' }}>
          {userName}
        </span>
        <ProfileMenu />
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

