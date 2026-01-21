// src/App.jsx (FINALIZED CODE)

import { Routes, Route, useLocation } from 'react-router-dom'
import './index.css' 
import { AnimatePresence } from 'framer-motion'

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
import PracticeOptions from './pages/PracticeOptions.jsx'
import QuizDashboard from './pages/QuizDashboard.jsx'
import QuizRoom from './pages/QuizRoom.jsx'
import QuizLeaderboard from './pages/QuizLeaderboard.jsx'
import QuizProfile from './pages/QuizProfile.jsx'
import QuizSettings from './pages/QuizSettings.jsx'
import RouteTheme from './components/RouteTheme.jsx'
import MotionPage from './components/MotionPage.jsx'


function App() {
  const location = useLocation()

  return (
    // <AuthProvider> TAGS ARE REMOVED HERE
      <AppProvider>
        <RouteTheme />
        <div className="min-vh-100 gradient-bg">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<MotionPage><Landing /></MotionPage>} />
              <Route path="/login" element={<MotionPage><Login /></MotionPage>} />
              <Route path="/register" element={<MotionPage><Register /></MotionPage>} />
            
              <Route
                path="/home"
                element={<MotionPage><ProtectedRoute><LanguageSelect /></ProtectedRoute></MotionPage>}
              />
              <Route
                path="/languages"
                element={<MotionPage><ProtectedRoute><LanguageSelect /></ProtectedRoute></MotionPage>}
              />
              <Route
                path="/practice"
                element={<MotionPage><ProtectedRoute><PracticeOptions /></ProtectedRoute></MotionPage>}
              />
              <Route
                path="/practice/quiz/dashboard"
                element={<MotionPage><ProtectedRoute><QuizDashboard /></ProtectedRoute></MotionPage>}
              />
              <Route
                path="/practice/quiz/room"
                element={<MotionPage><ProtectedRoute><QuizRoom /></ProtectedRoute></MotionPage>}
              />
              <Route
                path="/practice/quiz/leaderboard"
                element={<MotionPage><ProtectedRoute><QuizLeaderboard /></ProtectedRoute></MotionPage>}
              />
              <Route
                path="/practice/quiz/profile"
                element={<MotionPage><ProtectedRoute><QuizProfile /></ProtectedRoute></MotionPage>}
              />
              <Route
                path="/practice/quiz/settings"
                element={<MotionPage><ProtectedRoute><QuizSettings /></ProtectedRoute></MotionPage>}
              />
              <Route
                path="/levels/:lang"
                element={<MotionPage><ProtectedRoute><Levels /></ProtectedRoute></MotionPage>}
              />
              <Route
                path="/leaderboard"
                element={<MotionPage><ProtectedRoute><Leaderboard /></ProtectedRoute></MotionPage>}
              />

            {/* NEW ROUTE FOR THEORY AND QUIZ */}
              <Route
                path="/study/:lang/:levelId"
                element={<MotionPage><ProtectedRoute><TheoryQuizPage /></ProtectedRoute></MotionPage>}
              />
            
              <Route path="*" element={<MotionPage><Landing /></MotionPage>} />
            </Routes>
          </AnimatePresence>
        </div>
      </AppProvider>
    // </AuthProvider> TAGS ARE REMOVED HERE
  )
}

export default App