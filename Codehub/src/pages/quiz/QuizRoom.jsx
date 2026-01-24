// src/pages/quiz/QuizRoom.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../../state/useAuth';
import { quizApi } from '../../utils/quiz/api';
import './QuizRoom.css';

const QuizRoom = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentOptions, setCurrentOptions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [challengeName, setChallengeName] = useState('');
  const [domain, setDomain] = useState('Mixed');
  const [squadSize, setSquadSize] = useState(10);
  const [numQuestions, setNumQuestions] = useState(10);
  const [timeLimit, setTimeLimit] = useState(20);
  const [settings, setSettings] = useState({
    challengeName: '',
    domain: 'Mixed',
    maxPlayers: 10,
    numQuestions: 10,
    timeLimit: 20
  });
  const [players, setPlayers] = useState([]);
  const [chat, setChat] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [waitingForOthers, setWaitingForOthers] = useState(false);
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [showFinalResults, setShowFinalResults] = useState(false);

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  useEffect(() => {
    const u = currentUser;
    const displayName = (u?.displayName || u?.email || 'Player');
    setUsername(displayName);

    // Load saved defaults
    quizApi.get(`/settings/${encodeURIComponent(displayName)}`)
      .then((s) => {
        if (s) {
          setDomain(s.defaultDomain || domain);
          setNumQuestions(Number(s.defaultQuestions || numQuestions));
          setTimeLimit(Number(s.defaultTimeLimit || timeLimit));
          setSquadSize(Number(s.maxPlayers || squadSize));
        }
      })
      .catch((err) => {
        console.warn('Failed to load settings', err);
      });

    // Connect socket
    socketRef.current = io(SOCKET_URL, { 
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('✅ Connected to socket server:', socket.id);
    });

    socket.on('connected', (data) => {
      console.log('✅ Server confirmation:', data);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connect_error:', err?.message || err);
      // Don't show alert immediately, let reconnection attempts happen
    });

    socket.on('disconnect', (reason) => {
      console.warn('⚠️ Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected the socket, reconnect manually
        socket.connect();
      }
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('✅ Reconnected after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed. Please refresh the page.');
      alert('Cannot connect to game server. Please refresh the page or check if the server is running.');
    });

    socket.on('quizError', (data) => {
      console.error('❌ Quiz error:', data.message);
      alert(data.message || 'An error occurred during the quiz.');
    });

    socket.on('roomUpdate', (room) => {
      setPlayers(room.players || []);
      setSettings(room.settings || settings);
      if (room.maxPlayers) {
        setSettings((prev) => ({ ...prev, maxPlayers: room.maxPlayers }));
      }
      setGeneratedCode(room.roomCode || generatedCode);
      sortPlayersByScore(room.players || []);
    });

    socket.on('quizStarted', (data) => {
      console.log('Quiz start signal received');
      setQuizStarted(true);
      setCurrentQuestionIndex(data.currentQuestionIndex || 0);
      setCurrentQuestion(data.currentQuestion);
      setCurrentOptions(data.currentOptions || []);
      setHasAnswered(false);
      setWaitingForOthers(false);
      setTimeLeftSeconds(data.timeLimit || 20);
      if (data.numQuestions) {
        setSettings((prev) => ({ ...prev, numQuestions: data.numQuestions }));
      }
    });

    socket.on('timer', (timeLeft) => {
      setTimeLeftSeconds(timeLeft);
    });

    socket.on('answerSubmitted', (data) => {
      setCurrentAnswers(data.currentAnswers);
      if (data.player === displayName) {
        setHasAnswered(true);
        setWaitingForOthers(true);
      }
      setPlayers(data.players || []);
      sortPlayersByScore(data.players || []);
    });

    socket.on('questionFinished', (data) => {
      console.log('Question finished, correct answer:', data.correctAnswer);
      setPlayers(data.players);
      setHasAnswered(false);
      setWaitingForOthers(false);
      sortPlayersByScore(data.players);
    });

    socket.on('quizFinished', (data) => {
      setQuizStarted(false);
      setPlayers(data.finalScores || []);
      sortPlayersByScore(data.finalScores || []);
      setShowFinalResults(true);
      console.log('Final scores:', data.finalScores);
    });

    socket.on('chatMessage', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      if (socket) {
        try {
          socket.disconnect();
        } catch (err) {
          console.warn('Error disconnecting socket', err);
        }
      }
    };
  }, []);

  const sortPlayersByScore = (playersList) => {
    const sorted = [...playersList].sort((a, b) => (b.score || 0) - (a.score || 0));
    setPlayers(sorted);
  };

  const createRoom = () => {
    const roomSettings = {
      challengeName,
      domain,
      maxPlayers: Number(squadSize || 10),
      numQuestions: Number(numQuestions || 10),
      timeLimit: Number(timeLimit || 20)
    };
    setSettings(roomSettings);
    if (!socketRef.current) return alert('Socket not connected');
    socketRef.current.emit('createRoom', { username, settings: roomSettings }, (res) => {
      if (res?.success) {
        setGeneratedCode(res.roomCode);
        setIsOwner(true);
        setSettings(res.settings);
      } else {
        alert('Create room failed');
      }
    });
  };

  const joinRoom = () => {
    if (!roomCode.trim()) return alert('Enter code');
    if (!socketRef.current) return alert('Socket not connected');
    socketRef.current.emit('joinRoom', { username, roomCode }, (res) => {
      if (res?.success) {
        setGeneratedCode(res.roomCode);
        setIsOwner((res.roomOwner === username) || isOwner);
      } else {
        alert(res?.message || 'Join failed');
      }
    });
  };

  const startQuiz = () => {
    if (!isOwner || !generatedCode) return;
    if (!socketRef.current) return alert('Socket not connected');
    socketRef.current.emit('startQuiz', { roomCode: generatedCode, username });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !generatedCode) return;
    if (!socketRef.current) return alert('Socket not connected');
    socketRef.current.emit('chatMessage', {
      roomCode: generatedCode,
      username,
      message: newMessage
    });
    setNewMessage('');
  };

  const copyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode).then(() => {
      console.log('Room code copied');
    }).catch(() => {
      const input = document.createElement('input');
      input.value = generatedCode;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      console.log('Room code copied (fallback)');
    });
  };

  const chooseOption = (option) => {
    if (hasAnswered || !generatedCode) return;
    const index = currentOptions.indexOf(option);
    if (index === -1) return;
    console.log('Selected option index:', index);
    if (!socketRef.current) return alert('Socket not connected');
    socketRef.current.emit('submitAnswer', {
      roomCode: generatedCode,
      username,
      answer: index
    });
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
      case 0: return 'WINNER';
      case 1: return '2nd Place';
      case 2: return '3rd Place';
      default: return `${index + 1}th Place`;
    }
  };

  return (
    <div className="room">
      <header>
        <div className="brand">QUIZ <span>PRACTICE</span></div>
        <div className="spacer"></div>
        <div className="user">👤 {username}</div>
        <button className="logout" onClick={() => navigate('/quiz/dashboard')}>Back to Dashboard</button>
      </header>

      <main>
        {!generatedCode && (
          <div className="pre-room">
            <div className="create-panel">
              <h2>Forge Your Challenge!</h2>
              <input
                type="text"
                value={challengeName}
                onChange={(e) => setChallengeName(e.target.value)}
                placeholder="e.g. Brain Busters Arena"
              />
              <label>Choose Domain</label>
              <div className="domains">
                <button
                  className={domain === 'Verbal' ? 'active' : ''}
                  onClick={() => setDomain('Verbal')}
                >
                  Verbal
                </button>
                <button
                  className={domain === 'Logical' ? 'active' : ''}
                  onClick={() => setDomain('Logical')}
                >
                  Logical
                </button>
                <button
                  className={domain === 'Quant' ? 'active' : ''}
                  onClick={() => setDomain('Quant')}
                >
                  Quantitative Aptitude
                </button>
                <button
                  className={domain === 'Mixed' ? 'active' : ''}
                  onClick={() => setDomain('Mixed')}
                >
                  Mixed
                </button>
              </div>
              <label>Number of Questions</label>
              <input
                type="number"
                min="1"
                max="50"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
              />
              <label>Max Players</label>
              <input
                type="number"
                min="2"
                max="20"
                value={squadSize}
                onChange={(e) => setSquadSize(Number(e.target.value))}
              />
              <label>Time Limit per Question (seconds)</label>
              <input
                type="number"
                min="10"
                max="120"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
              />
              <button className="primary" onClick={createRoom}>Create Battleground!</button>
            </div>

            <div className="join-panel">
              <h2>Leap into the Arena!</h2>
              <p>Join with an invite code</p>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Invite Code"
              />
              <button className="success" onClick={joinRoom}>Join Room</button>
            </div>
          </div>
        )}

        {generatedCode && (
          <div className="lobby">
            <div className="code-box">
              Invite Code: {generatedCode}
              <button className="logout" onClick={copyCode}>Copy</button>
            </div>

            <header className="settings-bar">
              {settings.challengeName && (
                <div className="challenge-title">
                  <h2>🏆 {settings.challengeName}</h2>
                </div>
              )}
              <div className="summary">
                <div>Players: {players.length} / {settings.maxPlayers || squadSize}</div>
                <div>Questions: {settings.numQuestions}</div>
                <div>Category: {settings.domain}</div>
                <div>Time Limit: {settings.timeLimit}s</div>
              </div>
              {isOwner && !quizStarted && (
                <div className="owner-controls">
                  <button className="accent" onClick={startQuiz} disabled={players.length < 1}>
                    Start Quiz!
                  </button>
                </div>
              )}
            </header>

            <main className="game-layout">
              <aside className="players">
                <h3>🏆 Leaderboard</h3>
                <ul>
                  {players.map((p, i) => (
                    <li
                      key={i}
                      className={`${i === 0 ? 'rank-1' : ''} ${i === 1 ? 'rank-2' : ''} ${i === 2 ? 'rank-3' : ''} ${p.username === username ? 'current-player' : ''}`}
                    >
                      <span className="rank-icon">{getRankIcon(i)}</span>
                      <span className="player-name">{p.username}</span>
                      <span className="score">{p.score || 0} pts</span>
                    </li>
                  ))}
                </ul>
              </aside>

              <section className="whiteboard">
                {!quizStarted && !showFinalResults && (
                  <h2>Waiting for host to start...</h2>
                )}

                {quizStarted && !showFinalResults && (
                  <>
                    <div className="qcard">
                      <div className="q-meta">
                        <div>Q {currentQuestionIndex + 1} / {settings.numQuestions}</div>
                        <div className={`timer ${timeLeftSeconds <= 10 ? 'warning' : ''}`}>
                          ⏱ {timeLeftSeconds}s
                        </div>
                      </div>
                      <h2 className="q">{currentQuestion}</h2>
                      <div className="opts">
                        {currentOptions.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => chooseOption(opt)}
                            disabled={hasAnswered}
                            className={`${hasAnswered ? 'answered' : ''} ${currentAnswers[username] === i ? 'selected' : ''}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {hasAnswered && waitingForOthers && (
                        <div className="waiting">
                          <p>✅ Answer submitted! Waiting for other players...</p>
                          <div className="answers-status">
                            {players.map((player) => (
                              <div key={player.username} className="player-status">
                                <span className="player-name">{player.username}</span>
                                <span className="status-icon">
                                  {currentAnswers[player.username] !== undefined ? '✅' : '⏳'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {showFinalResults && (
                  <div className="final-results">
                    <div className="results-header">
                      <h1>🎉 Quiz Complete!</h1>
                      <p>Final Rankings</p>
                    </div>
                    <div className="podium">
                      {players.slice(0, 3).map((player, i) => (
                        <div
                          key={i}
                          className={`podium-item ${i === 0 ? 'rank-1' : ''} ${i === 1 ? 'rank-2' : ''} ${i === 2 ? 'rank-3' : ''}`}
                        >
                          <div className="rank-badge">{getRankIcon(i)}</div>
                          <div className="player-info">
                            <h3>{getRankText(i)}</h3>
                            <p className="player-name">{player.username}</p>
                            <p className="final-score">{player.score || 0} points</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="results-footer">
                      <p>🏆 Congratulations to all participants!</p>
                      <button className="play-again" onClick={() => {
                        setShowFinalResults(false);
                        setGeneratedCode(null);
                        setQuizStarted(false);
                        setPlayers([]);
                      }}>
                        Play Again
                      </button>
                    </div>
                  </div>
                )}
              </section>

              <aside className="chat">
                <h3>Chat</h3>
                <div className="messages">
                  {chat.map((msg, i) => (
                    <div key={i}>{msg}</div>
                  ))}
                </div>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
              </aside>
            </main>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizRoom;

