// src/pages/Levels.jsx (COMPLETE CODE)

import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { useApp } from '../hooks/useApp'
import ProfileMenu from '../components/ProfileMenu.jsx'

import { LEVEL_DATA } from '../data/levelData'

// --- LEVEL DATA HELPER ---
const getLevelsForLanguage = (lang) => {
  if (LEVEL_DATA[lang]) {
    return Object.entries(LEVEL_DATA[lang]).map(([id, data]) => ({
      id,
      title: data.title,
      xp: data.xp
    }))
  }
  // Fallback if language not found
  return [
    { id: '1', title: 'Level 1: Basics', xp: 50 },
    { id: '2', title: 'Level 2: Control Flow', xp: 75 },
  ]
}
// -----------------------------


export default function Levels() {
  const { lang } = useParams()
  const navigate = useNavigate()
  const { state } = useApp() // Dispatch is no longer needed here

  // Get dynamic levels based on the URL parameter
  const levels = useMemo(() => getLevelsForLanguage(lang), [lang])
  
  // Progress calculation
  const completed = new Set(state.levelsByLanguage[lang] || [])
  const totalXP = levels.reduce((sum, l) => sum + l.xp, 0)
  const currentXP = state.xpByLanguage[lang] || 0
  const progress = Math.min(100, Math.round((currentXP / totalXP) * 100))

  // CRITICAL CHANGE: This now navigates to the timed study page
  const startLevel = (level) => {
    // Navigate to the new study route: /study/:lang/:levelId
    navigate(`/study/${lang}/${level.id}`);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <Motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/languages')}
            className="btn btn-outline-light"
            title="Back to Languages"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ whiteSpace: 'nowrap' }}
          >
            ← Back to Languages
          </Motion.button>
          <Motion.h1
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="neon-text display-4 fw-bold text-capitalize mb-0"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
          >
            {lang} Levels
          </Motion.h1>
        </div>
        <div className="ms-auto">
          <ProfileMenu />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-5 p-4 card-glow" style={{ backgroundColor: '#151a2d', borderRadius: '10px' }}>
        <h3 className="h5 text-light mb-2">Your Progress</h3>
        <div className="progress mb-2" style={{ height: '15px', backgroundColor: '#333' }}>
          <div
            className="progress-bar bg-info"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progress}%
          </div>
        </div>
        <p className="text-muted">Total XP: {currentXP} / {totalXP}</p>
      </div>


      {/* Level Cards */}
      <div className="levels-list">
        <div className="row g-4">
          {levels.map((lvl, i) => {
            const isDone = completed.has(lvl.id)
            return (
              <div key={lvl.id} className="col-12 col-md-6">
                <Motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`level-card card-glow p-4 ${isDone ? 'opacity-75' : ''}`}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h3 className="h4 fw-bold mb-1">{lvl.title}</h3>
                      <p className="text-muted mb-0">Reward: Up to {lvl.xp} XP</p>
                    </div>
                    {isDone && (
                      <span className="badge bg-success text-dark px-3 py-2">
                        COMPLETED
                      </span>
                    )}
                  </div>

                  <div className="text-end">
                    <button
                      disabled={isDone}
                      // CRITICAL: Call the startLevel function
                      onClick={() => startLevel(lvl)}
                      className={`btn ${isDone ? 'btn-completed' : 'btn-neon'} px-4 py-2`}
                    >
                      {isDone ? 'Completed' : 'START LEVEL'}
                    </button>
                  </div>
                </Motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}