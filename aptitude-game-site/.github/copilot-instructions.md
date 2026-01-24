# Aptitude Arena - AI Coding Assistant Instructions

## Project Overview
Aptitude Arena is a real-time multiplayer quiz game built with the MERN stack (MongoDB, Express, React, Node.js). It features Firebase authentication, Socket.io for real-time gameplay, and supports multiple quiz domains (Verbal, Logical, Quantitative, Mixed).

## Architecture
- **Frontend**: React (Vite) with React Router, Firebase Auth, Socket.io client
- **Backend**: Express server with Socket.io for real-time quiz rooms and REST APIs
- **Database**: MongoDB with Mongoose schemas for questions, scores, and user settings
- **Real-time Communication**: Socket.io handles quiz room management, question distribution, and live scoring

## Key Components & Data Flow

### Quiz Flow
1. **Room Creation**: Owner creates room with settings (domain, question count, time limit)
2. **Player Joining**: Players join via 4-digit room code
3. **Quiz Start**: Owner initiates quiz, questions sent via Socket.io
4. **Question Timer**: 20-second default timer with real-time countdown
5. **Answer Submission**: Players submit answers, scores calculated with time bonus
6. **Results**: Final scores saved to MongoDB, leaderboard updated

### Scoring System
```javascript
const baseScore = 100;
const timeBonus = Math.floor((answerTime / timeLimit) * 50);
const totalScore = baseScore + timeBonus; // Max 150 points per question
```

### Socket Events (Backend)
- `createRoom`: Generate room code, fetch random questions from MongoDB
- `joinRoom`: Add player to room, validate username uniqueness
- `startQuiz`: Begin quiz, emit first question
- `submitAnswer`: Record answer, calculate score, check if all players answered
- `chatMessage`: Broadcast chat messages in room

### REST APIs
- `GET /api/random-question?domain=X`: Fetch single random question
- `GET /api/leaderboard`: Aggregate user scores and rankings
- `GET /api/profile/:username`: User statistics and rank
- `GET/PUT /api/settings/:username`: User preferences (theme, sound, etc.)

## Development Workflow

### Local Development
```bash
# Backend (port 5000)
cd backend && npm start

# Frontend (port 5173)
cd frontend && npm run dev

# Database seeding
cd backend && node seed-data.js
```

### Environment Variables
**Backend (.env)**:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aptitude_game
NODE_ENV=development
```

**Frontend (.env)**:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Code Patterns & Conventions

### File Structure
```
frontend/src/
├── pages/          # Route components (.jsx)
├── components/     # Reusable components (.jsx)
├── contexts/       # React contexts (AuthContext.jsx)
├── config/         # Firebase, environment configs (.js)
└── utils/          # API utilities (.js)
```

### Authentication
- Firebase Auth with email/password and Google provider
- `AuthContext` provides `currentUser`, login/logout methods
- Protected routes use `ProtectedRoute` component
- Username derived from `user.displayName || user.email`

### Socket.io Integration
```javascript
// Frontend connection
const socket = io(environment.socketUrl);

// Room management
socket.emit('createRoom', { username, settings });
socket.on('roomUpdate', (room) => setPlayers(room.players));

// Quiz events
socket.on('quizStarted', ({ currentQuestion, currentOptions, timeLimit }) => {
  // Handle new question
});
```

### MongoDB Schemas
```javascript
// Questions
{
  question: String,
  options: [String],
  answer: Number,  // Index of correct option
  domain: String   // "Verbal", "Logical", "Quantitative", "Mixed"
}

// Scores
{
  username: String,
  score: Number,
  domain: String,
  createdAt: Date
}
```

### CORS Configuration
Backend allows origins for development (`localhost:5173`) and production URLs. Update `allowedOrigins` array when deploying to new environments.

### Deployment
- **Render.com**: Separate services for backend (Node.js) and frontend (static)
- **Environment URLs**: Hardcoded in some files (server.js, Room.jsx) - update for new deployments
- **Database**: MongoDB Atlas for production, local MongoDB for development

## Common Tasks

### Adding New Quiz Domains
1. Update question seeding script (`seed-data.js`)
2. Add domain option to frontend settings
3. Update domain filtering in `/api/random-question`

### Modifying Scoring
- Edit scoring logic in `server.js` `submitAnswer` event
- Update time bonus calculation if needed
- Test with different time limits

### Adding New Settings
1. Update `UserSettings` schema in `server.js`
2. Add settings to frontend Settings page
3. Update default values in room creation

### Real-time Features
- All quiz state managed through Socket.io events
- Use `io.to(roomCode).emit()` for room broadcasts
- Handle disconnections gracefully (rooms persist until quiz ends)

## Testing
- Backend tests: `test-server.js`, `test-score-storage.js`, `test-time-scoring.js`
- Run with `npm test` (if configured)
- Manual testing: Create room, join with multiple browser tabs

## Troubleshooting
- **Socket connection issues**: Check `VITE_SOCKET_URL` matches backend port
- **CORS errors**: Verify `allowedOrigins` includes current frontend URL
- **MongoDB connection**: Ensure MongoDB is running and URI is correct
- **Firebase config**: Check API keys and project settings</content>
<parameter name="filePath">d:\college\4th year\BTech project\btech project\aptitude-game-site\.github\copilot-instructions.md