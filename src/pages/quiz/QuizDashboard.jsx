// src/pages/quiz/QuizDashboard.jsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/useAuth';
import { logout } from '../../services/firebase';
import './QuizDashboard.css';

const QuizDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const displayName = useMemo(() => {
    const u = currentUser;
    return u?.displayName || u?.email || 'Player';
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const open = (section) => {
    switch (section) {
      case 'quiz':
        navigate('/quiz/room');
        break;
      case 'leaderboard':
        navigate('/quiz/leaderboard');
        break;
      case 'profile':
        navigate('/quiz/profile');
        break;
      case 'settings':
        navigate('/quiz/settings');
        break;
      default:
        alert(`Open ${section} (not implemented)`);
    }
  };

  return (
    <div className="dash">
      <header>
        <div className="brand">QUIZ <span>PRACTICE</span></div>
        <div className="spacer"></div>
        <div className="user">👤 {displayName}</div>
        <button className="logout" onClick={() => navigate('/practice')}>Back to Practice</button>
        <button className="logout" onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
      </header>

      <main style={{ padding: '40px 30px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
        <div className="grid" style={{ maxWidth: '1200px', width: '100%' }}>
          <button 
            type="button"
            className="tile" 
            onClick={() => open('quiz')}
            aria-label="Start Quiz"
            style={{ minHeight: '200px' }}
          >
            <div className="t" style={{ fontSize: '28px', marginBottom: '15px' }}>🎮 Start Quiz</div>
            <p>Sharpen logic, speed, accuracy. Challenge yourself with timed aptitude questions.</p>
          </button>
          <button 
            type="button"
            className="tile" 
            onClick={() => open('leaderboard')}
            aria-label="View Leaderboard"
            style={{ minHeight: '200px' }}
          >
            <div className="t" style={{ fontSize: '28px', marginBottom: '15px' }}>🏆 Leaderboard</div>
            <p>Compete with the best. See where you rank among top players.</p>
          </button>
          <button 
            type="button"
            className="tile" 
            onClick={() => open('profile')}
            aria-label="View Profile"
            style={{ minHeight: '200px' }}
          >
            <div className="t" style={{ fontSize: '28px', marginBottom: '15px' }}>👤 Profile</div>
            <p>Track your progress. View your stats, scores, and achievements.</p>
          </button>
          <button 
            type="button"
            className="tile" 
            onClick={() => open('settings')}
            aria-label="Open Settings"
            style={{ minHeight: '200px' }}
          >
            <div className="t" style={{ fontSize: '28px', marginBottom: '15px' }}>⚙️ Settings</div>
            <p>Tune your arena. Customize quiz preferences and defaults.</p>
          </button>
        </div>
      </main>
    </div>
  );
};

export default QuizDashboard;

