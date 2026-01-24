import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const displayName = useMemo(() => {
    const u = auth.currentUser;
    return u?.displayName || u?.email || 'Player';
  }, [auth.currentUser]);

  const onLogout = async () => {
    await auth.logout();
    navigate('/auth');
  };

  const open = (section) => {
    switch (section) {
      case 'quiz':
        navigate('/quiz/room');
        break;
      case 'leaderboard':
        navigate('/leaderboard');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        alert(`Open ${section} (not implemented)`);
    }
  };

  return (
    <div className="dash">
      <header>
        <div className="brand">APTITUDE <span>ARENA</span></div>
        <div className="spacer"></div>
        <div className="user">👤 {displayName}</div>
        <button className="logout" onClick={onLogout}>Logout</button>
      </header>

      <main>
        <div className="grid">
          <button 
            type="button"
            className="tile" 
            onClick={() => open('quiz')}
            aria-label="Start Quiz"
          >
            <div className="t">Start Quiz</div>
            <p>Sharpen logic, speed, accuracy.</p>
          </button>
          <button 
            type="button"
            className="tile" 
            onClick={() => open('leaderboard')}
            aria-label="View Leaderboard"
          >
            <div className="t">Leaderboard</div>
            <p>Compete with the best.</p>
          </button>
          <button 
            type="button"
            className="tile" 
            onClick={() => open('profile')}
            aria-label="View Profile"
          >
            <div className="t">Profile</div>
            <p>Track your progress.</p>
          </button>
          <button 
            type="button"
            className="tile" 
            onClick={() => open('settings')}
            aria-label="Open Settings"
          >
            <div className="t">Settings</div>
            <p>Tune your arena.</p>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


