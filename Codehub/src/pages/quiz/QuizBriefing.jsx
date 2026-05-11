// src/pages/quiz/QuizBriefing.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/useAuth';
import './QuizBriefing.css';

const QuizBriefing = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/quiz/room');
  };

  const handleLogout = async () => {
    const { logout } = await import('../../services/firebase');
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const displayName = currentUser?.displayName || currentUser?.email || 'Player';

  return (
    <div className="quiz-briefing-container">
      <header className="briefing-header">
        <div className="briefing-brand">QUIZ <span>PRACTICE</span></div>
        <div className="briefing-spacer"></div>
        <div className="briefing-user-menu">
          <span>👤 {displayName}</span>
          <button className="briefing-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="briefing-content">
        <h1 className="briefing-title">Quiz Briefing</h1>
        <p className="briefing-subtitle">
          Read these quick rules before you enter the lobby. Everything below keeps multiplayer 
          matches fair and perfectly synced.
        </p>

        {/* How to Create a Room */}
        <section className="briefing-section">
          <div className="section-row">
            <div className="section-card">
              <h2 className="section-title">How to Create a Room</h2>
              <ul className="section-content">
                <li>Set a memorable challenge name and pick a category</li>
                <li>Review the auto-assigned timer (based on category) and adjust the number of questions.</li>
                <li>Pick the squad size (up to 20). The default lobby reserves spots for 10 players.</li>
                <li>Hit "Create Battleground" to generate a shareable invite code.</li>
              </ul>
            </div>
            <div className="section-card">
              <h2 className="section-title">How to Join a Room</h2>
              <ul className="section-content">
                <li>Grab the 4-digit invite code from your friend or host</li>
                <li>Enter it in the Join Room card</li>
                <li>You'll land directly in the lobby with synced timers and chat.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Matchmaking & Lobby Flow */}
        <section className="briefing-section">
          <h2 className="section-title">Matchmaking & Lobby Flow</h2>
          <div className="section-details">
            <p>Rooms are private by design—only players with the code can join.</p>
            <p>Hosts stay in control of quiz settings until the game starts.</p>
            <p>Timer pulses are broadcast from the server, so every player sees the exact same countdown.</p>
          </div>
        </section>

        {/* Answering Rules */}
        <section className="briefing-section">
          <h2 className="section-title">Answering Rules</h2>
          <div className="section-details">
            <p>You can lock in only one answer per question.</p>
            <p>If the timer hits zero before you respond, we auto-submit "No Answer" so the match keeps moving.</p>
            <p>Once everyone answers (or the timer expires), we instantly grade and push the next question.</p>
          </div>
        </section>

        {/* Timer Logic Per Category */}
        <section className="briefing-section">
          <h2 className="section-title">Timer Logic Per Category</h2>
          <div className="timer-grid">
            <div className="timer-card">
              <h3>Verbal Ability</h3>
              <p className="timer-value">30 seconds/question</p>
              <p className="timer-description">Fast-paced vocabulary and comprehension prompts. You get 30 seconds to answer.</p>
            </div>
            <div className="timer-card">
              <h3>Quantitative Aptitude</h3>
              <p className="timer-value">90 seconds/question</p>
              <p className="timer-description">Computation heavy problems. You have up to 90 seconds to crunch the numbers.</p>
            </div>
            <div className="timer-card">
              <h3>Logical Reasoning</h3>
              <p className="timer-value">60 seconds/question</p>
              <p className="timer-description">Pattern and deduction challenges give you 60 seconds per attempt.</p>
            </div>
            <div className="timer-card timer-card-full">
              <h3>Mixed Mode</h3>
              <p className="timer-value">60 seconds/question</p>
              <p className="timer-description">Mixed playlists inherit each question's native timer. When unknown, 60 seconds are applied.</p>
            </div>
          </div>
          <p className="timer-note">⏱️ Timers are enforced on the server—when it hits zero, we auto-submit and move on.</p>
        </section>

        {/* Constraints */}
        <section className="briefing-section">
          <div className="constraints-row">
            <div className="constraint-card">
              <h3>Minimum Players</h3>
              <p className="constraint-value">You need at least 2 players</p>
              <p className="constraint-text">to start a multiplayer quiz. Hosts can start early if idle, but the lobby reminds everyone about the minimum.</p>
            </div>
            <div className="constraint-card">
              <h3>Maximum Players</h3>
              <p className="constraint-value">Each room supports up to 20 challengers.</p>
              <p className="constraint-text">The creator can choose a lower cap, but never above 20.</p>
            </div>
            <div className="constraint-card">
              <h3>Room Creation Limit</h3>
              <p className="constraint-value">Each user can host one active room at a time.</p>
              <p className="constraint-text">Finish or close a room to free yourself to host a new challenge.</p>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <div className="briefing-footer">
          <button className="briefing-continue-btn" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizBriefing;
