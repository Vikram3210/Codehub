// src/pages/quiz/QuizLeaderboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/useAuth';
import { quizApi } from '../../utils/quiz/api';
import './QuizLeaderboard.css';

const QuizLeaderboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await quizApi.get('/leaderboard');
      const sorted = [...data].sort((a, b) => {
        if (a.rank != null && b.rank != null) return a.rank - b.rank;
        return (b.totalScore || 0) - (a.totalScore || 0);
      });
      const mapped = sorted.map((u, idx) => ({ ...u, rank: u.rank ?? idx + 1 }));
      setLeaderboard(mapped);
      findCurrentUserRank(mapped);
      setLoading(false);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('Failed to load leaderboard');
      setLoading(false);
    }
  };

  const findCurrentUserRank = (list) => {
    const currentUsername = currentUser?.displayName || currentUser?.email || 'Player';
    const found = list.find(user => user.username === currentUsername);
    setCurrentUserRank(found?.rank || 0);
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}.`;
    }
  };

  const getRankText = (index) => {
    switch (index) {
      case 0: return 'CHAMPION';
      case 1: return '2nd Place';
      case 2: return '3rd Place';
      default: return `${index + 1}th Place`;
    }
  };

  const currentUsername = currentUser?.displayName || currentUser?.email || 'Player';

  return (
    <div className="leaderboard-page">
      <header>
        <div className="brand">QUIZ <span>LEADERBOARD</span></div>
        <div className="spacer"></div>
        <div className="user">👤 {currentUsername}</div>
        <button className="logout" onClick={() => navigate('/quiz/dashboard')}>Back to Dashboard</button>
      </header>

      <main>
        <div className="leaderboard-container">
          <div className="header-section">
            <h1>🏆 Global Leaderboard</h1>
            <p>Compete with players worldwide and climb the ranks!</p>
            <button className="refresh-btn" onClick={loadLeaderboard} disabled={loading}>
              {loading ? 'Loading...' : '🔄 Refresh'}
            </button>
          </div>

          {currentUserRank > 0 && (
            <div className="current-user-rank">
              <div className="rank-card current-user">
                <div className="rank-info">
                  <span className="rank-number">#{currentUserRank}</span>
                  <span className="rank-label">Your Rank</span>
                </div>
                <div className="user-info">
                  <h3>{currentUsername}</h3>
                  <p>Keep playing to improve your rank!</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading leaderboard...</p>
            </div>
          )}

          {error && (
            <div className="error">
              <p>❌ {error}</p>
              <button onClick={loadLeaderboard}>Try Again</button>
            </div>
          )}

          {!loading && !error && (
            <div className="leaderboard">
              <div className="leaderboard-header">
                <div className="rank-col">Rank</div>
                <div className="player-col">Player</div>
                <div className="score-col">Total Score</div>
                <div className="games-col">Games</div>
                <div className="avg-col">Average</div>
              </div>

              <div className="leaderboard-list">
                {leaderboard.map((player, i) => (
                  <div
                    key={i}
                    className={`player-row ${i === 0 ? 'rank-1' : ''} ${i === 1 ? 'rank-2' : ''} ${i === 2 ? 'rank-3' : ''} ${player.username === currentUsername ? 'current-user-row' : ''}`}
                  >
                    <div className="rank-cell">
                      <span className="rank-icon">{getRankIcon(i)}</span>
                      <span className="rank-text">{getRankText(i)}</span>
                    </div>
                    <div className="player-cell">
                      <div className="player-avatar">👤</div>
                      <div className="player-details">
                        <h4>{player.username || player._id || 'Unknown'}</h4>
                        {i < 3 && <span className="player-badge">Top {i + 1}</span>}
                      </div>
                    </div>
                    <div className="score-cell">
                      <span className="score-value">{player.totalScore}</span>
                      <span className="score-label">points</span>
                    </div>
                    <div className="games-cell">
                      <span className="games-value">{player.gamesPlayed}</span>
                      <span className="games-label">games</span>
                    </div>
                    <div className="avg-cell">
                      <span className="avg-value">{player.averageScore}</span>
                      <span className="avg-label">avg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !error && leaderboard.length === 0 && (
            <div className="empty-state">
              <h3>🎯 No Players Yet</h3>
              <p>Be the first to play and claim the top spot!</p>
              <button className="play-btn" onClick={() => navigate('/quiz/dashboard')}>Start Playing</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizLeaderboard;


