// src/pages/Levels.jsx (CLEAN & COMPLETE)

import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { useApp } from '../hooks/useApp'
import ProfileMenu from '../components/ProfileMenu.jsx'
import PrerequisiteTest from '../components/PrerequisiteTest'

import { LEVEL_DATA } from '../data/levelData'

// --- LEVEL DATA HELPER ---
const getLevelsForLanguage = (lang) => {
  if (LEVEL_DATA[lang]) {
    return Object.entries(LEVEL_DATA[lang]).map(([id, data]) => ({
      id,
      title: data.title,
      xp: data.xp,
    }))
  }

  // Fallback
  return [
    { id: '1', title: 'Level 1: Basics', xp: 50 },
    { id: '2', title: 'Level 2: Control Flow', xp: 75 },
  ]
}
// -------------------------

export default function Levels() {
  const { lang } = useParams()
  const navigate = useNavigate()
  const { state } = useApp()

  const levels = useMemo(() => getLevelsForLanguage(lang), [lang])

  // Progress
  const completed = new Set(state.levelsByLanguage?.[lang] || [])
  const totalXP = levels.reduce((sum, l) => sum + l.xp, 0)
  const currentXP = state.xpByLanguage?.[lang] || 0
  const progress = Math.min(
    100,
    totalXP === 0 ? 0 : Math.round((currentXP / totalXP) * 100)
  )

  // Navigate to study page
  const startLevel = (level) => {
    navigate(`/study/${lang}/${level.id}`)
  }

  // Handle prerequisite test completion
  const handlePrerequisiteComplete = (score, percentage) => {
    dispatch({
      type: 'completePrerequisiteTest',
      lang: lang,
      score: score,
      percentage: percentage
    })
  }

  // Show prerequisite test if not completed
  if (!hasCompletedPrerequisite) {
    return (
      <PrerequisiteTest
        lang={lang}
        levelData={LEVEL_DATA}
        onComplete={handlePrerequisiteComplete}
        onExit={() => navigate('/languages')}
      />
    )
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/languages')}
            className="btn btn-outline-light"
          >
            ← Back to Languages
          </Motion.button>

          <Motion.h1 className="neon-text display-4 fw-bold text-capitalize mb-0">
            {lang} Levels
          </Motion.h1>
        </div>

        <div className="d-flex align-items-center gap-3">
          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/leaderboard')}
            className="btn btn-outline-info"
          >
            🏆 Leaderboard
          </Motion.button>

          <ProfileMenu />
        </div>
      </div>

      {/* Progress */}
      <div className="mb-5 p-4 card-glow" style={{ backgroundColor: '#151a2d' }}>
        <h3 className="h5 text-light mb-2">Your Progress</h3>

        <div className="progress mb-2" style={{ height: '15px' }}>
          <div
            className="progress-bar bg-info"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>

        <p className="text-muted">
          Total XP: {currentXP} / {totalXP}
        </p>
      </div>

      {/* Levels */}
      <div className="row g-4">
        {levels.map((lvl, i) => {
          const isDone = completed.has(lvl.id)

          return (
            <div key={lvl.id} className="col-12 col-md-6">
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`level-card card-glow p-4 ${
                  isDone ? 'opacity-75' : ''
                }`}
              >
                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <h3 className="h4 fw-bold">{lvl.title}</h3>
                    <p className="text-muted mb-0">
                      Reward: {lvl.xp} XP
                    </p>
                  </div>

                  {isDone && (
                    <span className="badge bg-success text-dark">
                      COMPLETED
                    </span>
                  )}
                </div>

                <div className="text-end">
                  <button
                    disabled={isDone}
                    onClick={() => startLevel(lvl)}
                    className={`btn ${
                      isDone ? 'btn-completed' : 'btn-neon'
                    } px-4 py-2`}
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
  )
}
