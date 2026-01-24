// src/pages/LanguageSelect.jsx
// src/pages/LanguageSelect.jsx
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
// CRITICAL FIX: Change this line:
import { useAuth } from '../state/useAuth'
import { logout } from '../services/firebase'
// ... rest of the component
import ProfileMenu from '../components/ProfileMenu.jsx'
import { motion } from 'framer-motion'
// import '../styles/LanguageSelect.css' // Uncomment if you have this file

// ... rest of the component code (same as previous response)
const LANGS = [
  { key: 'javascript', label: 'JavaScript', gradient: 'linear-gradient(135deg, #ffd23f 0%, #ff6b35 100%)' },
  { key: 'python', label: 'Python', gradient: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)' },
  { key: 'java', label: 'Java', gradient: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)' },
  { key: 'cpp', label: 'C++', gradient: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)' },
]

export default function LanguageSelect() {
  const navigate = useNavigate()
  const { dispatch } = useApp()
  const { currentUser } = useAuth() 

  const userName =
    currentUser?.displayName ||
    currentUser?.email?.split('@')[0] ||
    'Coder'

  const handleSelect = (key) => {
    dispatch({ type: 'selectLanguage', lang: key })
    navigate(`/levels/${key}`)
  }
  
  const handleLogout = async () => {
    try {
      await logout()
    } catch (e) {
      console.error('Logout failed:', e)
    }
  }

  return (
    <div className="container-fluid min-vh-100 p-4 gradient-bg">
      <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/practice')}
            className="btn btn-outline-light"
            title="Back to Practice"
            style={{ whiteSpace: 'nowrap' }}
          >
            ← Back to Practice
          </motion.button>
          <h2 className="text-light fw-bold mb-0" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>
            Welcome, {userName}!
          </h2>
        </div>
        
        <div className="d-flex align-items-center gap-3 ms-auto flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/leaderboard')}
            className="btn btn-outline-info"
            title="View Leaderboard"
            style={{ whiteSpace: 'nowrap' }}
          >
            🏆 Leaderboard
          </motion.button>
          <ProfileMenu /> 
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="btn btn-logout"
            title="Logout"
            style={{ whiteSpace: 'nowrap' }}
          >
            🚪 Logout
          </motion.button>
        </div>
      </div>

      <div className="container p-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <h1 className="display-4 fw-bold neon-text mb-3">
            Choose Your Path
          </h1>
          <p className="lead text-light-50">Select a language to start your coding quest and level up your skills.</p>
        </motion.div>

        <div className="row g-4 g-lg-5 justify-content-center">
          {LANGS.map((lang, i) => (
            <div key={lang.key} className="col-12 col-sm-6 col-lg-3">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 234, 255, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                onClick={() => handleSelect(lang.key)}
                className="btn w-100 language-card card-glow p-4 text-white d-flex flex-column align-items-center justify-content-center"
                style={{ 
                    height: '180px', 
                    background: lang.gradient,
                    border: 'none',
                    transition: 'all 0.3s',
                }}
              >
                <i className={`fs-1 mb-2 ${lang.icon || 'bi bi-code-slash'}`}></i> 
                <h3 className="h5 fw-bold mb-0">{lang.label}</h3>
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}