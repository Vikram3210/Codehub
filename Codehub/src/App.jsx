// src/App.jsx (FINALIZED CODE)

import { Routes, Route } from 'react-router-dom'
import './index.css' 

// Existing imports
import LanguageSelect from './pages/LanguageSelect.jsx'
import Levels from './pages/Levels.jsx'
import { AppProvider } from './state/AppContext.jsx'

// Components and Pages
// AuthProvider is NOT imported here because it's in main.jsx
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Landing from './pages/Landing.jsx' 
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
// NEW IMPORT
import TheoryQuizPage from './pages/TheoryQuizPage.jsx' 
import Leaderboard from './pages/Leaderboard.jsx'
// Practice Options and Quiz Pages
import PracticeOptions from './pages/PracticeOptions.jsx'
import CodingPractice from './pages/CodingPractice.jsx'
import QuizDashboard from './pages/quiz/QuizDashboard.jsx'
import QuizRoom from './pages/quiz/QuizRoom.jsx'
import QuizLeaderboard from './pages/quiz/QuizLeaderboard.jsx'
import QuizProfile from './pages/quiz/QuizProfile.jsx'
import QuizSettings from './pages/quiz/QuizSettings.jsx'


function App() {
  return (
    // <AuthProvider> TAGS ARE REMOVED HERE
      <AppProvider>
        <div className="min-vh-100 gradient-bg">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/home"
              element={<ProtectedRoute><LanguageSelect /></ProtectedRoute>}
            />
            <Route
              path="/languages"
              element={<ProtectedRoute><LanguageSelect /></ProtectedRoute>}
            />
            <Route
              path="/practice"
              element={<ProtectedRoute><PracticeOptions /></ProtectedRoute>}
            />
            <Route
              path="/coding-practice"
              element={<ProtectedRoute><CodingPractice /></ProtectedRoute>}
            />
            <Route
              path="/levels/:lang"
              element={<ProtectedRoute><Levels /></ProtectedRoute>}
            />
            <Route
              path="/leaderboard"
              element={<ProtectedRoute><Leaderboard /></ProtectedRoute>}
            />

            {/* NEW ROUTE FOR THEORY AND QUIZ */}
            <Route
              path="/study/:lang/:levelId"
              element={<ProtectedRoute><TheoryQuizPage /></ProtectedRoute>}
            />

            {/* Quiz Practice Routes */}
            <Route
              path="/quiz/dashboard"
              element={<ProtectedRoute><QuizDashboard /></ProtectedRoute>}
            />
            <Route
              path="/quiz/room"
              element={<ProtectedRoute><QuizRoom /></ProtectedRoute>}
            />
            <Route
              path="/quiz/leaderboard"
              element={<ProtectedRoute><QuizLeaderboard /></ProtectedRoute>}
            />
            <Route
              path="/quiz/profile"
              element={<ProtectedRoute><QuizProfile /></ProtectedRoute>}
            />
            <Route
              path="/quiz/settings"
              element={<ProtectedRoute><QuizSettings /></ProtectedRoute>}
            />
            
            <Route path="*" element={<Landing />} />
          </Routes>
        </div>
      </AppProvider>
    // </AuthProvider> TAGS ARE REMOVED HERE
  )
}

export default App