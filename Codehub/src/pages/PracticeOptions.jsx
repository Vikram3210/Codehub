// src/pages/PracticeOptions.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../state/useAuth'
import { logout } from '../services/firebase'
import WaveTransition from '../components/WaveTransition'

export default function PracticeOptions() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [showWaveTransition, setShowWaveTransition] = useState(false)

  const userName =
    currentUser?.displayName ||
    currentUser?.email?.split('@')[0] ||
    'Coder'

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleQuizPracticeClick = () => {
    setShowWaveTransition(true)
  }

  const handleWaveComplete = () => {
    navigate('/quiz/dashboard')
    setShowWaveTransition(false)
  }

  return (
    <>
      <WaveTransition 
        isActive={showWaveTransition} 
        onComplete={handleWaveComplete}
      />
      <div className="container-fluid min-vh-100 p-4 gradient-bg">
      <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <h2 className="text-light fw-bold mb-0" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>
            Welcome, {userName}!
          </h2>
        </div>
        
        <div className="d-flex align-items-center gap-3 ms-auto flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="btn btn-outline-danger"
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
            Choose Your Practice Mode
          </h1>
          <p className="lead text-light-50">Select how you want to practice and improve your skills.</p>
        </motion.div>

        <div className="row g-4 g-lg-5 justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 234, 255, 0.6)' }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="card card-glow p-5 text-white text-center"
              style={{ 
                height: '300px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onClick={handleQuizPracticeClick}
            >
              <div className="mb-4" style={{ fontSize: '4rem' }}>🧠</div>
              <h2 className="h3 fw-bold mb-3">Quiz Practice</h2>
              <p className="mb-0">Test your aptitude skills with timed quizzes. Compete with others and climb the leaderboard!</p>
            </motion.div>
          </div>

          <div className="col-12 col-md-6 col-lg-5">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 234, 255, 0.6)' }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="card card-glow p-5 text-white text-center"
              style={{ 
                height: '300px', 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onClick={() => navigate('/languages')}
            >
              <div className="mb-4" style={{ fontSize: '4rem' }}>💻</div>
              <h2 className="h3 fw-bold mb-3">Language Practice</h2>
              <p className="mb-0">Learn programming languages through interactive lessons, quizzes, and hands-on coding practice.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

