import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import languageRoutes from './server/routes/languageRoutes.js';
import lessonRoutes from './server/routes/lessonRoutes.js';
import questionRoutes from './server/routes/questionRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Configure CORS for Socket.io and Express
const isDevelopment = process.env.NODE_ENV !== 'production';

// In development, allow all localhost ports for flexibility
// In production, use specific origins
const allowedOrigins = isDevelopment
  ? [
      /^http:\/\/localhost:\d+$/, // Allow any localhost port in development
      process.env.FRONTEND_URL
    ].filter(Boolean)
  : [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (isDevelopment) {
      // In development, check if origin matches localhost pattern
      if (allowedOrigins.some(pattern => {
        if (pattern instanceof RegExp) {
          return pattern.test(origin);
        }
        return pattern === origin;
      })) {
        return callback(null, true);
      }
    } else {
      // In production, use exact match
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}));

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin
      if (!origin) return callback(null, true);
      
      if (isDevelopment) {
        // In development, allow any localhost port
        if (/^http:\/\/localhost:\d+$/.test(origin)) {
          return callback(null, true);
        }
      } else {
        // In production, use exact match
        const prodOrigins = [
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:3000',
          process.env.FRONTEND_URL
        ].filter(Boolean);
        if (prodOrigins.includes(origin)) {
          return callback(null, true);
        }
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection - CodeHub Database (for languages, lessons, etc.)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sakupatil2004_db_user:<db_password>@cluster0.f23zbb5.mongodb.net/CodeHub?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Database: CodeHub');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });

// Quiz Database Connection - IIT_project Database (for quiz questions)
// Use environment variable or fallback to the quiz database connection string
const QUIZ_MONGODB_URI = process.env.QUIZ_MONGODB_URI || 'mongodb+srv://ayushshirke123_db_user:IIT_project@quizappcluster.hnwrp1w.mongodb.net/IIT_project?retryWrites=true&w=majority&appName=QuizAppCluster';

const quizConnection = mongoose.createConnection(QUIZ_MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

quizConnection.on('connected', () => {
  console.log('✅ Connected to Quiz MongoDB Atlas');
  console.log('📊 Quiz Database: IIT_project');
  console.log('📚 Quiz Collection: questions');
  console.log('🔗 Connection String:', QUIZ_MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password
});

quizConnection.on('error', (error) => {
  console.error('❌ Quiz MongoDB connection error:', error.message);
});

quizConnection.on('disconnected', () => {
  console.warn('⚠️ Quiz MongoDB disconnected');
});

// Test connection on startup
quizConnection.asPromise()
  .then(() => {
    console.log('✅ Quiz database connection verified');
  })
  .catch((err) => {
    console.error('❌ Failed to connect to quiz database:', err.message);
    console.error('💡 Please check QUIZ_MONGODB_URI environment variable');
  });

// Quiz Models (using IIT_project database)
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: Number,
  domain: String,
}, { collection: 'questions' }); // Explicitly set collection name

const QuizQuestion = quizConnection.model('Question', questionSchema);

const scoreSchema = new mongoose.Schema({
  username: String,
  score: Number,
  domain: String,
  createdAt: { type: Date, default: Date.now },
}, { collection: 'scores' });

// Score model uses quiz connection (IIT_project database)
const Score = quizConnection.model('Score', scoreSchema);

const settingsSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  notifications: { type: Boolean, default: true },
  soundEffects: { type: Boolean, default: true },
  theme: { type: String, default: 'dark' },
  language: { type: String, default: 'en' },
  autoStart: { type: Boolean, default: false },
  defaultTimeLimit: { type: Number, default: 20 },
  defaultQuestions: { type: Number, default: 10 },
  defaultDomain: { type: String, default: 'Mixed' },
}, { collection: 'usersettings' });

// UserSettings model uses quiz connection (IIT_project database)
const UserSettings = quizConnection.model('UserSettings', settingsSchema);

// Quiz Settings
const DEFAULT_QUESTION_TIME = 20;
const REVEAL_TIME = 3000;
let rooms = {};

// Routes
app.use('/api/languages', languageRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/questions', questionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CodeHub API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    quizDatabase: quizConnection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Quiz Database Test Endpoint
app.get('/api/quiz/test', async (req, res) => {
  try {
    const totalQuestions = await QuizQuestion.countDocuments();
    const availableDomains = await QuizQuestion.distinct('domain');
    const domainCounts = {};
    
    for (const domain of availableDomains) {
      domainCounts[domain] = await QuizQuestion.countDocuments({ domain });
    }
    
    res.json({
      success: true,
      database: 'IIT_project',
      collection: 'questions',
      connectionStatus: quizConnection.readyState === 1 ? 'Connected' : 'Disconnected',
      totalQuestions,
      availableDomains,
      domainCounts,
      sampleQuestion: totalQuestions > 0 ? await QuizQuestion.findOne() : null
    });
  } catch (err) {
    console.error('❌ Quiz database test error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      connectionStatus: quizConnection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to CodeHub API',
    endpoints: {
      health: '/api/health',
      languages: '/api/languages',
      lessons: '/api/lessons',
      questions: '/api/questions'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Socket.io Quiz Logic
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  
  // Emit connection confirmation to client
  socket.emit('connected', { message: 'Connected to quiz server', socketId: socket.id });

  socket.on('createRoom', async ({ username, settings }, callback) => {
    try {
      // Verify quiz database connection
      if (quizConnection.readyState !== 1) {
        console.error('❌ Quiz database not connected');
        return callback?.({ 
          success: false, 
          message: 'Quiz database not available. Please try again later.' 
        });
      }

      const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
      let questions = [];
      const maxQuestions = Math.min(settings.numQuestions, 50);

      console.log(`🎯 Fetching ${maxQuestions} questions for domain: ${settings.domain}`);
      console.log(`📊 Active Database: IIT_project`);
      console.log(`📚 Active Collection: questions`);
      console.log(`🔗 Connection State: ${quizConnection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

      if (settings.domain === 'Mixed') {
        // For Mixed, fetch from all domains (Verbal, Quant, Logical)
        console.log(`🔍 Querying all domains for Mixed mode`);
        questions = await QuizQuestion.aggregate([{ $sample: { size: maxQuestions } }]);
        console.log(`📚 Found ${questions.length} questions from all domains`);
      } else {
        // First, get available domains to help with matching
        const availableDomains = await QuizQuestion.distinct('domain');
        console.log(`📋 Available domains in database:`, availableDomains);
        
        // Case-sensitive domain matching - try exact match first
        let queryDomain = settings.domain;
        
        // Try to match domain (case-sensitive)
        const exactMatch = availableDomains.find(d => d === settings.domain);
        if (exactMatch) {
          queryDomain = exactMatch;
        } else {
          // Try case-insensitive match
          const caseInsensitiveMatch = availableDomains.find(d => 
            d.toLowerCase() === settings.domain.toLowerCase()
          );
          if (caseInsensitiveMatch) {
            queryDomain = caseInsensitiveMatch;
            console.log(`⚠️ Domain case mismatch. Using "${caseInsensitiveMatch}" instead of "${settings.domain}"`);
          }
        }
        
        console.log(`🔍 Querying domain: "${queryDomain}" (requested: "${settings.domain}")`);
        
        questions = await QuizQuestion.aggregate([
          { $match: { domain: queryDomain } },
          { $sample: { size: maxQuestions } }
        ]);
        
        console.log(`📚 Found ${questions.length} questions for domain: ${queryDomain}`);
        
        // If still no questions, try common variations
        if (questions.length === 0) {
          const variations = {
            'Quant': ['Quantitative', 'Quantitative Aptitude', 'QA'],
            'Quantitative': ['Quant', 'Quantitative Aptitude', 'QA'],
            'Verbal': ['Verbal Reasoning', 'VR'],
            'Logical': ['Logical Reasoning', 'LR']
          };
          
          if (variations[settings.domain]) {
            for (const variant of variations[settings.domain]) {
              console.log(`⚠️ Trying variant: "${variant}"`);
              const variantQuestions = await QuizQuestion.aggregate([
                { $match: { domain: variant } },
                { $sample: { size: maxQuestions } }
              ]);
              if (variantQuestions.length > 0) {
                questions = variantQuestions;
                queryDomain = variant;
                console.log(`✅ Found ${questions.length} questions using variant: ${variant}`);
                break;
              }
            }
          }
        }
      }

      // Validate questions were found
      if (!questions || questions.length === 0) {
        console.warn(`⚠️ No questions found for domain: ${settings.domain}`);
        console.warn(`📊 Database: IIT_project, Collection: questions`);
        
        // Get available domains for debugging
        const availableDomains = await QuizQuestion.distinct('domain');
        console.log(`📋 Available domains in database:`, availableDomains);
        
        return callback?.({ 
          success: false, 
          message: `No questions available for domain: ${settings.domain}. Available domains: ${availableDomains.join(', ')}. Please try a different domain.` 
        });
      }
      
      console.log(`✅ Successfully loaded ${questions.length} questions for room ${roomCode}`);

      rooms[roomCode] = {
        roomCode,
        owner: username,
        players: [{ username, score: 0, answer: null }],
        currentIndex: 0,
        questions,
        settings: {
          ...settings,
          numQuestions: questions.length,
          timeLimit: settings.timeLimit || DEFAULT_QUESTION_TIME,
        },
        timeLeft: settings.timeLimit || DEFAULT_QUESTION_TIME,
        timerInterval: null,
        timerTimeout: null,
        isStarted: false,
      };

      socket.join(roomCode);
      callback?.({ success: true, roomCode, settings: rooms[roomCode].settings });
      io.to(roomCode).emit('roomUpdate', rooms[roomCode]);
    } catch (err) {
      console.error('❌ Error creating room:', err);
      callback?.({ success: false, message: 'Error creating room' });
    }
  });

  socket.on('joinRoom', ({ roomCode, username }, callback) => {
    const room = rooms[roomCode];
    if (!room) return callback?.({ success: false, message: 'Room not found' });
    if (room.players.find((p) => p.username === username)) {
      return callback?.({ success: false, message: 'Username taken' });
    }

    room.players.push({ username, score: 0, answer: null });
    socket.join(roomCode);
    callback?.({ success: true, roomCode, settings: room.settings });
    io.to(roomCode).emit('roomUpdate', room);
  });

  socket.on('startQuiz', ({ roomCode, username }) => {
    const room = rooms[roomCode];
    if (!room || room.owner !== username) return;
    room.currentIndex = 0;
    room.isStarted = true;
    sendQuestion(roomCode);
  });

  socket.on('submitAnswer', ({ roomCode, username, answer }) => {
    const room = rooms[roomCode];
    if (!room) return;

    const player = room.players.find((p) => p.username === username);
    if (!player || player.answer !== null) return;

    // Validate question exists before accessing
    if (!room.questions || room.currentIndex >= room.questions.length || !room.questions[room.currentIndex]) {
      console.error('❌ Cannot submit answer: Invalid question index');
      return;
    }

    player.answer = Number(answer);
    player.answerTime = room.timeLeft;

    if (player.answer === room.questions[room.currentIndex].answer) {
      const timeBonus = Math.floor((player.answerTime / room.settings.timeLimit) * 50);
      const baseScore = 100;
      const totalScore = baseScore + timeBonus;
      player.score += totalScore;
    }

    io.to(roomCode).emit('answerSubmitted', {
      currentAnswers: Object.fromEntries(room.players.map((p) => [p.username, p.answer])),
      players: room.players,
      player: username,
    });

    if (room.players.every((p) => p.answer !== null)) {
      finishQuestion(roomCode);
    }
  });

  socket.on('chatMessage', ({ roomCode, username, message }) => {
    const msg = `${username}: ${message}`;
    io.to(roomCode).emit('chatMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

function sendQuestion(roomCode) {
  const room = rooms[roomCode];
  if (!room) {
    console.error('❌ Room not found:', roomCode);
    return;
  }

  // Validate question exists
  if (!room.questions || room.questions.length === 0) {
    console.error('❌ No questions available for room:', roomCode);
    io.to(roomCode).emit('quizError', { message: 'No questions available. Please create a new room.' });
    return;
  }

  // Validate current index is within bounds
  if (room.currentIndex < 0 || room.currentIndex >= room.questions.length) {
    console.error('❌ Invalid question index:', room.currentIndex, 'for room:', roomCode);
    io.to(roomCode).emit('quizError', { message: 'Invalid question index. Quiz ended.' });
    return;
  }

  const q = room.questions[room.currentIndex];
  
  // Validate question object exists and has required fields
  if (!q || !q.question || !q.options || q.answer === undefined) {
    console.error('❌ Invalid question object at index:', room.currentIndex, 'for room:', roomCode);
    io.to(roomCode).emit('quizError', { message: 'Invalid question data. Please create a new room.' });
    return;
  }

  room.players.forEach((p) => (p.answer = null));
  room.timeLeft = room.settings.timeLimit;

  io.to(roomCode).emit('quizStarted', {
    currentQuestionIndex: room.currentIndex,
    currentQuestion: q.question,
    currentOptions: q.options,
    numQuestions: room.settings.numQuestions,
    players: room.players,
    timeLimit: room.settings.timeLimit,
  });

  clearInterval(room.timerInterval);
  clearTimeout(room.timerTimeout);

  room.timerInterval = setInterval(() => {
    room.timeLeft--;
    io.to(roomCode).emit('timer', room.timeLeft);
  }, 1000);

  room.timerTimeout = setTimeout(() => finishQuestion(roomCode), room.settings.timeLimit * 1000);
}

function finishQuestion(roomCode) {
  const room = rooms[roomCode];
  if (!room) return;

  clearInterval(room.timerInterval);
  clearTimeout(room.timerTimeout);

  // Validate question exists before accessing
  if (!room.questions || room.currentIndex >= room.questions.length || !room.questions[room.currentIndex]) {
    console.error('❌ Cannot finish question: Invalid question index');
    io.to(roomCode).emit('quizError', { message: 'Invalid question data. Quiz ended.' });
    return;
  }

  io.to(roomCode).emit('questionFinished', {
    correctAnswer: room.questions[room.currentIndex].answer,
    players: room.players,
  });

  setTimeout(async () => {
    room.currentIndex++;
    if (room.currentIndex < room.questions.length) {
      sendQuestion(roomCode);
    } else {
      io.to(roomCode).emit('quizFinished', { finalScores: room.players });

      for (const p of room.players) {
        try {
          await Score.create({
            username: p.username,
            score: p.score,
            domain: room.settings.domain,
          });
        } catch (err) {
          console.error('❌ Error saving score:', err);
        }
      }

      delete rooms[roomCode];
    }
  }, REVEAL_TIME);
}

// Quiz REST APIs
app.get('/api/random-question', async (req, res) => {
  try {
    const { domain } = req.query;
    let pipeline = [];

    console.log(`🔍 API: Fetching random question for domain: ${domain}`);
    console.log(`📊 Database: IIT_project, Collection: questions`);

    if (domain && domain !== 'Mixed') {
      const domainMap = {
        'Verbal': 'Verbal',
        'Quant': 'Quant',
        'Quantitative': 'Quant',
        'Logical': 'Logical',
      };
      const queryDomain = domainMap[domain] || domain;
      pipeline.push({ $match: { domain: queryDomain } });
      console.log(`🔍 Querying domain: "${queryDomain}"`);
    }

    pipeline.push({ $sample: { size: 1 } });
    const question = await QuizQuestion.aggregate(pipeline);

    console.log(`📚 Found ${question.length} question(s)`);

    if (question.length === 0) {
      const availableDomains = await QuizQuestion.distinct('domain');
      console.log(`📋 Available domains:`, availableDomains);
      return res.status(404).json({ 
        message: 'No question found for this domain',
        availableDomains 
      });
    }

    res.json(question[0]);
  } catch (err) {
    console.error('❌ Error fetching random question:', err);
    res.status(500).json({ message: 'Failed to fetch question' });
  }
});

app.post('/api/score', async (req, res) => {
  const { username, score, domain } = req.body;
  try {
    await Score.create({ username, score, domain });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboardAgg = await Score.aggregate([
      {
        $group: {
          _id: '$username',
          totalScore: { $sum: '$score' },
          gamesPlayed: { $sum: 1 },
          averageScore: { $avg: '$score' },
        },
      },
      { $addFields: { averageScore: { $round: ['$averageScore', 0] } } },
      { $sort: { totalScore: -1 } },
    ]);

    const leaderboard = leaderboardAgg.map((u, idx) => ({
      _id: u._id,
      username: u._id,
      totalScore: u.totalScore,
      gamesPlayed: u.gamesPlayed,
      averageScore: u.averageScore,
      rank: idx + 1,
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json([]);
  }
});

app.get('/api/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const userStats = await Score.aggregate([
      { $match: { username } },
      {
        $group: {
          _id: '$username',
          totalScore: { $sum: '$score' },
          gamesPlayed: { $sum: 1 },
          averageScore: { $avg: '$score' },
        },
      },
      { $addFields: { averageScore: { $round: ['$averageScore', 0] } } },
    ]);

    if (userStats.length === 0) {
      return res.json({
        username,
        email: username,
        totalScore: 0,
        gamesPlayed: 0,
        averageScore: 0,
        rank: 0,
        joinDate: new Date().toISOString(),
      });
    }

    const allUsers = await Score.aggregate([
      { $group: { _id: '$username', totalScore: { $sum: '$score' } } },
      { $sort: { totalScore: -1 } },
    ]);

    const userRank = allUsers.findIndex((user) => user._id === username) + 1;

    res.json({
      username: userStats[0]._id,
      email: username,
      totalScore: userStats[0].totalScore,
      gamesPlayed: userStats[0].gamesPlayed,
      averageScore: userStats[0].averageScore,
      rank: userRank,
      joinDate: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/profile/username', async (req, res) => {
  try {
    const { currentUsername, newUsername } = req.body;
    await Score.updateMany({ username: currentUsername }, { $set: { username: newUsername } });
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating username:', err);
    res.status(500).json({ error: 'Failed to update username' });
  }
});

app.get('/api/settings/:username', async (req, res) => {
  try {
    const { username } = req.params;
    let doc = await UserSettings.findOne({ username });
    if (!doc) {
      doc = await UserSettings.create({ username });
    }
    res.json(doc);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const { username, settings } = req.body;
    if (!username || !settings) return res.status(400).json({ error: 'Invalid payload' });
    await UserSettings.updateOne({ username }, { $set: { ...settings, username } }, { upsert: true });
    const saved = await UserSettings.findOne({ username });
    res.json({ success: true, settings: saved });
  } catch (err) {
    console.error('Error saving settings:', err);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🔌 Socket.io server ready`);
});

