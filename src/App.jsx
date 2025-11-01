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
              path="/levels/:lang"
              element={<ProtectedRoute><Levels /></ProtectedRoute>}
            />

            {/* NEW ROUTE FOR THEORY AND QUIZ */}
            <Route
              path="/study/:lang/:levelId"
              element={<ProtectedRoute><TheoryQuizPage /></ProtectedRoute>}
            />
            
            <Route path="*" element={<Landing />} />
          </Routes>
        </div>
      </AppProvider>
    // </AuthProvider> TAGS ARE REMOVED HERE
  )
}

export default App