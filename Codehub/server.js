import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectCodeHubDB } from './server/config/db.js';
import languageRoutes from './server/routes/languageRoutes.js';
import lessonRoutes from './server/routes/lessonRoutes.js';
import questionRoutes from './server/routes/questionRoutes.js';
import prerequisiteRoutes from './server/routes/prerequisiteRoutes.js';
import codeExecutionRoutes from './server/routes/codeExecutionRoutes.js';
import UserSettings from './server/models/UserSettings.js';
import QuizScore from './server/models/QuizScore.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

/* ==============================
   ✅ PROPER CORS CONFIGURATION
   Localhost (any port) + Vercel + FRONTEND_URL
================================= */

const allowedOriginList = [
  process.env.FRONTEND_URL,
  'https://codehub-peach.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
].filter(Boolean);

const localhostRegex = /^http:\/\/localhost(:\d+)?$/;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOriginList.includes(origin)) return callback(null, true);
    if (localhostRegex.test(origin)) return callback(null, true);
    console.error("❌ Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
/* ==============================
   ✅ SETTINGS ROUTES
================================= */

app.get('/api/settings/:username', async (req, res) => {
  try {
    const { username } = req.params;
    let doc = await UserSettings.findOne({ username });
    if (!doc) {
      doc = await UserSettings.create({ username });
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const { username, settings } = req.body;
    await UserSettings.updateOne(
      { username },
      { $set: { ...settings, username } },
      { upsert: true }
    );
    const saved = await UserSettings.findOne({ username });
    res.json({ success: true, settings: saved });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

/* ==============================
   ✅ SOCKET.IO CORS
================================= */

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOriginList.includes(origin)) return callback(null, true);
      if (localhostRegex.test(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"), false);
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

/* ==============================
   ✅ MIDDLEWARE
================================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==============================
   ✅ QUIZ DATABASE CONNECTION
================================= */

const QUIZ_MONGODB_URI = process.env.QUIZ_MONGODB_URI;

if (!QUIZ_MONGODB_URI) {
  console.error("❌ QUIZ_MONGODB_URI is not set in environment variables");
  process.exit(1);
}

const quizConnection = mongoose.createConnection(QUIZ_MONGODB_URI);

quizConnection.on('connected', () => {
  console.log('✅ Quiz MongoDB Connected');
});

quizConnection.on('error', (err) => {
  console.error('❌ Quiz MongoDB Error:', err.message);
});

/* ==============================
   ✅ ROUTES
================================= */

app.use('/api/languages', languageRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/prerequisites', prerequisiteRoutes);
app.use('/api', codeExecutionRoutes);

/* ==============================
   ✅ QUIZ LEADERBOARD (aggregate by userId from QuizScore)
================================= */

app.get('/api/leaderboard', async (req, res) => {
  try {
    const agg = await QuizScore.aggregate([
      { $group: { _id: '$userId', totalScore: { $sum: '$score' }, gamesPlayed: { $sum: 1 } } },
      { $addFields: { averageScore: { $round: [{ $divide: ['$totalScore', '$gamesPlayed'] }, 0] } } },
      { $sort: { totalScore: -1 } },
      { $project: { username: '$_id', totalScore: 1, gamesPlayed: 1, averageScore: 1, _id: 0 } },
    ]);
    res.json(agg);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
});

/* ==============================
   ✅ QUIZ PROFILE (stats from QuizScore + username update)
================================= */

app.get('/api/profile/:username', async (req, res) => {
  try {
    const username = decodeURIComponent(req.params.username);
    const scores = await QuizScore.find({ userId: username });
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const gamesPlayed = scores.length;
    const averageScore = gamesPlayed ? Math.round(totalScore / gamesPlayed) : 0;

    const rankAgg = await QuizScore.aggregate([
      { $group: { _id: '$userId', totalScore: { $sum: '$score' } } },
      { $sort: { totalScore: -1 } },
      { $group: { _id: null, ranks: { $push: '$_id' } } },
      { $unwind: { path: '$ranks', includeArrayIndex: 'rank' } },
      { $match: { ranks: username } },
      { $project: { rank: { $add: ['$rank', 1] }, _id: 0 } },
    ]);
    const rank = rankAgg[0]?.rank ?? 0;

    res.json({
      username,
      totalScore,
      gamesPlayed,
      averageScore,
      rank,
    });
  } catch (err) {
    console.error('Profile GET error:', err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

app.put('/api/profile/username', async (req, res) => {
  try {
    const { currentUsername, newUsername } = req.body;
    if (!currentUsername || !newUsername || currentUsername === newUsername) {
      return res.status(400).json({ error: 'currentUsername and newUsername required and must differ' });
    }
    const result = await QuizScore.updateMany(
      { userId: currentUsername },
      { $set: { userId: newUsername } }
    );
    res.json({ success: true, updated: result.modifiedCount });
  } catch (err) {
    console.error('Profile username update error:', err);
    res.status(500).json({ error: 'Failed to update username' });
  }
});

/* ==============================
   ✅ HEALTH CHECK
================================= */

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    codeHubDatabase:
      mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    quizDatabase:
      quizConnection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

/* ==============================
   ✅ ROOT
================================= */

app.get('/', (req, res) => {
  res.json({ message: 'CodeHub API Running' });
});

/* ==============================
   ✅ ERROR HANDLER
================================= */

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

/* ==============================
   ✅ START SERVER
================================= */

async function startServer() {
  try {
    await connectCodeHubDB();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at /api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();