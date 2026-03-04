/**
 * Quiz battle socket handlers: createRoom, joinRoom, startQuiz, submitAnswer, chat.
 * All quiz data (questions, etc.) from QUIZ_MONGODB_URI - models passed in as options.
 */
const ROOM_CODE_LENGTH = 6;
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O, 1/I

const rooms = new Map(); // roomCode -> { owner, players: [{ username, score, socketId }], settings, questions: [], currentQuestionIndex, timeLimit, timerHandle, currentAnswers }

function generateRoomCode() {
  let code = '';
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return rooms.has(code) ? generateRoomCode() : code;
}

/**
 * IIT_project questions format: { question, options[], answer (0-based index), domain }.
 */
async function fetchQuestions(count, models, domainFilter) {
  const { Question: Q } = models || {};
  if (!Q) return [];
  const num = Math.min(Math.max(Number(count) || 10, 1), 50);
  const match = {};
  if (domainFilter && domainFilter !== 'Mixed') {
    match.domain = domainFilter; // Verbal, Quant, Logical
  }
  const list = await Q.aggregate([
    { $match: Object.keys(match).length ? match : {} },
    { $sample: { size: num } },
    { $project: { question: 1, options: 1, answer: 1, domain: 1 } },
  ]);
  return list.map((q) => {
    const options = Array.isArray(q.options) ? q.options : [];
    const answer = q.answer;
    const correctIndex =
      typeof answer === 'number' && answer >= 0 && answer < options.length
        ? answer
        : 0;
    return {
      question: q.question || '',
      options,
      correctIndex,
    };
  });
}

function getRoomPayload(room) {
  return {
    roomCode: room.roomCode,
    players: room.players.map((p) => ({ username: p.username, score: p.score ?? 0 })),
    settings: room.settings,
    maxPlayers: room.settings?.maxPlayers,
  };
}

function clearRoomTimer(room) {
  if (room.timerHandle) {
    clearInterval(room.timerHandle);
    room.timerHandle = null;
  }
}

export function registerQuizSocket(io, quizModels = {}) {
  const { PrerequisiteQuestion: Prereq, Question: Q, QuizScore } = quizModels;

  io.on('connection', (socket) => {
    socket.emit('connected', { message: 'Connected to quiz server' });

    socket.on('createRoom', async (payload, callback) => {
      const username = payload?.username || 'Player';
      const settings = payload?.settings || {};
      const roomCode = generateRoomCode();
      const room = {
        roomCode,
        owner: username,
        players: [{ username, score: 0, socketId: socket.id }],
        settings: {
          challengeName: settings.challengeName || '',
          domain: settings.domain || 'Mixed',
          maxPlayers: Math.min(20, Math.max(2, Number(settings.maxPlayers) || 10)),
          numQuestions: Math.min(50, Math.max(1, Number(settings.numQuestions) || 10)),
          timeLimit: Math.min(120, Math.max(10, Number(settings.timeLimit) || 20)),
        },
        questions: [],
        currentQuestionIndex: 0,
        timeLimit: settings.timeLimit || 20,
        currentAnswers: {},
        timerHandle: null,
      };
      rooms.set(roomCode, room);
      socket.join(roomCode);
      socket.roomCode = roomCode;
      socket.roomUsername = username;

      if (typeof callback === 'function') {
        callback({ success: true, roomCode, settings: room.settings });
      }
      io.to(roomCode).emit('roomUpdate', getRoomPayload(room));
    });

    socket.on('joinRoom', (payload, callback) => {
      const username = payload?.username || 'Player';
      const roomCode = String(payload?.roomCode || '').trim().toUpperCase();
      const room = rooms.get(roomCode);

      if (!room) {
        if (typeof callback === 'function') callback({ success: false, message: 'Room not found' });
        return;
      }
      if (room.quizStarted) {
        if (typeof callback === 'function') callback({ success: false, message: 'Quiz already started' });
        return;
      }
      const maxPlayers = room.settings?.maxPlayers || 10;
      if (room.players.length >= maxPlayers) {
        if (typeof callback === 'function') callback({ success: false, message: 'Room is full' });
        return;
      }
      if (room.players.some((p) => p.username === username)) {
        if (typeof callback === 'function') callback({ success: false, message: 'Username already in room' });
        return;
      }

      room.players.push({ username, score: 0, socketId: socket.id });
      socket.join(roomCode);
      socket.roomCode = roomCode;
      socket.roomUsername = username;

      if (typeof callback === 'function') {
        callback({ success: true, roomCode, roomOwner: room.owner });
      }
      io.to(roomCode).emit('roomUpdate', getRoomPayload(room));
    });

    socket.on('startQuiz', async (payload) => {
      const roomCode = payload?.roomCode;
      const username = payload?.username;
      const room = roomCode ? rooms.get(roomCode) : null;

      if (!room) {
        socket.emit('quizError', { message: 'Room not found' });
        return;
      }
      if (room.owner !== username) {
        socket.emit('quizError', { message: 'Only the host can start the quiz' });
        return;
      }
      if (room.quizStarted) {
        socket.emit('quizError', { message: 'Quiz already started' });
        return;
      }

      try {
        room.questions = await fetchQuestions(
          room.settings.numQuestions,
          quizModels,
          room.settings.domain
        );
      } catch (err) {
        console.error('Fetch questions error:', err);
        socket.emit('quizError', { message: 'Failed to load questions' });
        return;
      }

      if (room.questions.length === 0) {
        socket.emit('quizError', { message: 'No questions available. Add questions to the database.' });
        return;
      }

      room.quizStarted = true;
      room.currentQuestionIndex = 0;
      room.currentAnswers = {};
      clearRoomTimer(room);

      const q = room.questions[0];
      const timeLimit = room.settings.timeLimit || 20;
      room.timeLeft = timeLimit;

      io.to(roomCode).emit('quizStarted', {
        currentQuestion: q.question,
        currentOptions: q.options,
        currentQuestionIndex: 0,
        timeLimit,
        numQuestions: room.settings.numQuestions,
      });

      room.timerHandle = setInterval(() => {
        room.timeLeft -= 1;
        io.to(roomCode).emit('timer', room.timeLeft);
        if (room.timeLeft <= 0) {
          clearRoomTimer(room);
          finishQuestion(io, room, QuizScore);
        }
      }, 1000);
    });

    socket.on('submitAnswer', (payload) => {
      const roomCode = payload?.roomCode;
      const username = payload?.username;
      const answerIndex = typeof payload?.answer === 'number' ? payload.answer : -1;
      const room = roomCode ? rooms.get(roomCode) : null;

      if (!room || !room.quizStarted) return;
      if (room.currentAnswers[username] !== undefined) return; // already answered

      const q = room.questions[room.currentQuestionIndex];
      if (!q) return;

      room.currentAnswers[username] = answerIndex;
      const correct = answerIndex === q.correctIndex;
      const player = room.players.find((p) => p.username === username);
      if (player) {
        const remaining = typeof room.timeLeft === 'number' && room.timeLeft > 0 ? room.timeLeft : 0;
        const points = correct ? 100 + remaining : 0;
        player.score = (player.score || 0) + points;
      }

      io.to(roomCode).emit('answerSubmitted', {
        currentAnswers: { ...room.currentAnswers },
        player: username,
        players: room.players.map((p) => ({ username: p.username, score: p.score ?? 0 })),
      });

<<<<<<< HEAD
      // Do NOT reveal the correct answer early.
      // We intentionally let the per-question timer run until it hits 0,
      // and only then finishQuestion() will emit the correct answer.
=======
      const totalPlayers = room.players.length;
      const answered = Object.keys(room.currentAnswers).length;
      if (answered >= totalPlayers) {
        clearRoomTimer(room);
        finishQuestion(io, room, QuizScore);
      }
>>>>>>> b7fd677 (404 error fix on refreshing)
    });

    socket.on('chatMessage', (payload) => {
      const roomCode = payload?.roomCode;
      const username = payload?.username;
      const message = payload?.message;
      if (!roomCode || !username) return;
      const text = `${username}: ${message || ''}`;
      io.to(roomCode).emit('chatMessage', text);
    });

    socket.on('disconnect', () => {
      const roomCode = socket.roomCode;
      const username = socket.roomUsername;
      if (!roomCode || !username) return;
      const room = rooms.get(roomCode);
      if (!room) return;

      room.players = room.players.filter((p) => p.socketId !== socket.id);
      if (room.players.length === 0) {
        clearRoomTimer(room);
        rooms.delete(roomCode);
        return;
      }
      if (room.owner === username) {
        room.owner = room.players[0]?.username || '';
      }
      io.to(roomCode).emit('roomUpdate', getRoomPayload(room));
    });
  });
}

function finishQuestion(io, room, QuizScore) {
  const roomCode = room.roomCode;
  const q = room.questions[room.currentQuestionIndex];
  io.to(roomCode).emit('questionFinished', {
    players: room.players.map((p) => ({ username: p.username, score: p.score ?? 0 })),
    correctAnswer: q ? q.correctIndex : -1,
  });

  room.currentQuestionIndex += 1;
  room.currentAnswers = {};

  if (room.currentQuestionIndex >= room.questions.length) {
    const finalScores = room.players
      .map((p) => ({ username: p.username, score: p.score ?? 0 }))
      .sort((a, b) => b.score - a.score);

    // Persist final scores to the quiz scores collection (for leaderboard/profile)
    if (QuizScore) {
      const domain = room.settings?.domain || 'Mixed';
      const docs = finalScores.map((p) => ({
        username: p.username,
        score: p.score ?? 0,
        domain,
      }));
      QuizScore.insertMany(docs)
        .then(() => {
          console.log('✅ Saved quiz scores for room', roomCode);
        })
        .catch((err) => {
          console.error('❌ Failed to save quiz scores for room', roomCode, err);
        });
    }

    io.to(roomCode).emit('quizFinished', { finalScores });
    rooms.delete(roomCode);
    return;
  }

  const nextQ = room.questions[room.currentQuestionIndex];
  const timeLimit = room.settings.timeLimit || 20;
  room.timeLeft = timeLimit;

  room.timerHandle = setInterval(() => {
    room.timeLeft -= 1;
    io.to(roomCode).emit('timer', room.timeLeft);
    if (room.timeLeft <= 0) {
      clearRoomTimer(room);
      finishQuestion(io, room, QuizScore);
    }
  }, 1000);

  io.to(roomCode).emit('quizStarted', {
    currentQuestion: nextQ.question,
    currentOptions: nextQ.options,
    currentQuestionIndex: room.currentQuestionIndex,
    timeLimit,
    numQuestions: room.settings.numQuestions,
  });
}
