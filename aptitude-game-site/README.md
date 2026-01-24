# Aptitude Arena - MERN Stack

A real-time multiplayer aptitude quiz game built with MongoDB, Express, React, and Node.js.

## Project Structure

```
aptitude-game-site/
├── frontend/          # React application (JavaScript)
│   ├── src/
│   │   ├── pages/    # Page components (.jsx)
│   │   ├── components/ # Reusable components (.jsx)
│   │   ├── contexts/  # React contexts (Auth) (.jsx)
│   │   ├── config/    # Configuration files (.js)
│   │   └── utils/     # Utility functions (.js)
│   ├── public/        # Static assets
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/           # Express server
│   ├── server.js     # Main server file
│   └── package.json
└── README.md
```

## Features

- 🔐 Firebase Authentication (Email/Password & Google Sign-in)
- 🎮 Real-time multiplayer quiz rooms
- 📊 Leaderboard system
- 👤 User profiles and statistics
- ⚙️ Customizable settings
- 🎯 Multiple question domains (Verbal, Logical, Quantitative, Mixed)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (MongoDB Atlas or local instance)
- Firebase project (for authentication)

## Installation

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Environment Variables

### Backend

Create a `.env` file in the `backend/` directory:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

### Frontend

Create a `.env` file in the `frontend/` directory:

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Build for Production

### Frontend

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

## Technologies Used

- **Frontend**: React (JavaScript), React Router, Firebase, Socket.io Client, Vite
- **Backend**: Node.js, Express, Socket.io, MongoDB, Mongoose
- **Authentication**: Firebase Auth
- **Database**: MongoDB

## License

ISC
