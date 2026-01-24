// src/pages/Levels.jsx (COMPLETE CODE)

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
    return Object.entries(LEVEL_DATA[lang])
      .map(([id, data]) => ({
        id,
        title: data.title,
        xp: data.xp,
        order: typeof data.order === 'number' ? data.order : 999,
      }))
      .sort((a, b) => a.order - b.order)
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
  const { state, dispatch } = useApp()

  // Debug logging
  console.log('Levels component - lang:', lang, 'state:', state)

  // Check if prerequisite test is completed
  const prerequisiteResult = state.prerequisiteTests?.[lang]
  const hasCompletedPrerequisite = prerequisiteResult?.completed || false
  const unlockedDifficulty = prerequisiteResult?.unlockedDifficulty || 'easy'

  console.log('Prerequisite check - hasCompleted:', hasCompletedPrerequisite, 'result:', prerequisiteResult)

  // Progress calculation - define completed first
  const completed = new Set(state.levelsByLanguage[lang] || [])

  // Get dynamic levels based on the URL parameter
  const levels = useMemo(() => {
    const allLevels = getLevelsForLanguage(lang)
    // Add difficulty and ensure order is included
    return allLevels.map(l => ({
      ...l,
      difficulty: LEVEL_DATA[lang]?.[l.id]?.difficulty || 'intermediate',
      order: LEVEL_DATA[lang]?.[l.id]?.order || l.order || 999
    }))
  }, [lang])

  const easyLevels = useMemo(() => levels.filter(l => l.difficulty === 'easy'), [levels])
  const intermediateLevels = useMemo(() => levels.filter(l => l.difficulty === 'intermediate'), [levels])

  const completedEasyLevels = useMemo(() => easyLevels.filter(l => completed.has(l.id)), [easyLevels, completed])
  const completedIntermediateLevels = useMemo(() => intermediateLevels.filter(l => completed.has(l.id)), [intermediateLevels, completed])

  const allEasyCompleted = easyLevels.length > 0 && completedEasyLevels.length === easyLevels.length
  const allIntermediateCompleted = intermediateLevels.length > 0 && completedIntermediateLevels.length === intermediateLevels.length

  const allowedDifficulties = useMemo(() => {
    if (!hasCompletedPrerequisite) {
      return new Set()
    }

    if (unlockedDifficulty === 'advanced') {
      return new Set(['easy', 'intermediate', 'advanced'])
    }

    if (unlockedDifficulty === 'intermediate') {
      return new Set(['easy', 'intermediate'])
    }

    const allowed = new Set(['easy'])

    if (allEasyCompleted || easyLevels.length === 0) {
      allowed.add('intermediate')

      if (allIntermediateCompleted || intermediateLevels.length === 0) {
        allowed.add('advanced')
      }
    }

    return allowed
  }, [
    hasCompletedPrerequisite,
    unlockedDifficulty,
    allEasyCompleted,
    allIntermediateCompleted,
    easyLevels.length,
    intermediateLevels.length
  ])

  const difficultyOrder = { easy: 1, intermediate: 2, advanced: 3 }

  const sortedLevels = useMemo(() => {
    return levels.slice().sort((a, b) => {
      const diffA = difficultyOrder[a.difficulty] || 999
      const diffB = difficultyOrder[b.difficulty] || 999
      if (diffA !== diffB) return diffA - diffB
      return (a.order || 999) - (b.order || 999)
    })
  }, [levels])
  
  // Progress calculation
  const totalXP = levels.reduce((sum, l) => sum + l.xp, 0)
  const currentXP = state.xpByLanguage[lang] || 0
  const progress = Math.min(100, Math.round((currentXP / totalXP) * 100))

  // Navigate to the study route
  const startLevel = (level) => {
    navigate(`/study/${lang}/${level.id}`);
  };

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
        <div className="d-flex align-items-center gap-3 ms-auto flex-wrap">
          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/leaderboard')}
            className="btn btn-outline-info"
            title="View Leaderboard"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            style={{ whiteSpace: 'nowrap' }}
          >
            🏆 Leaderboard
          </Motion.button>
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


      {/* Prerequisite Test Result Banner */}
      {hasCompletedPrerequisite && (
        <div className="mb-4 p-4 card-glow" style={{ backgroundColor: '#1a3a1a', borderRadius: '10px' }}>
          <div>
            <h5 className="text-light mb-2">Prerequisite Test: {prerequisiteResult.score}/20 ({prerequisiteResult.percentage.toFixed(1)}%)</h5>
            {unlockedDifficulty === 'advanced' ? (
              <p className="text-success mb-0">🎉 Excellent work! You can access <strong>all levels</strong> (Easy, Intermediate, Advanced).</p>
            ) : unlockedDifficulty === 'intermediate' ? (
              <p className="text-success mb-0">✅ You can access <strong>Easy</strong> and <strong>Intermediate</strong> levels. Score 16+ on the prerequisite test to unlock Advanced instantly.</p>
            ) : (
              <p className="text-warning mb-0">📚 You can access <strong>Easy</strong> levels. Finish every Easy level to unlock Intermediate. After Intermediate is complete, Advanced will unlock automatically, or score 16+ on the prerequisite test to skip ahead.</p>
            )}
            {easyLevels.length > 0 && (
              <p className="text-muted small mt-2 mb-1">Easy Levels Completed: {completedEasyLevels.length}/{easyLevels.length}</p>
            )}
            {intermediateLevels.length > 0 && (
              <p className="text-muted small mb-0">Intermediate Levels Completed: {completedIntermediateLevels.length}/{intermediateLevels.length}</p>
            )}
          </div>
        </div>
      )}

      {/* Level Cards - Show all levels with lock status */}
      <div className="levels-list">
        <div className="row g-4">
          {sortedLevels.map((lvl, i) => {
            const isDone = completed.has(lvl.id)
            const isLocked = !allowedDifficulties.has(lvl.difficulty)

            let lockMessage = ''
            if (isLocked) {
              if (lvl.difficulty === 'intermediate') {
                if (unlockedDifficulty === 'easy') {
                  lockMessage = 'Complete all Easy levels to unlock Intermediate.'
                } else {
                  lockMessage = 'Score 14+ on the prerequisite test to unlock Intermediate.'
                }
              } else if (lvl.difficulty === 'advanced') {
                if (unlockedDifficulty === 'intermediate') {
                  lockMessage = 'Score 16+ on the prerequisite test to unlock Advanced.'
                } else if (unlockedDifficulty === 'easy') {
                  if (!allEasyCompleted) {
                    lockMessage = 'Complete all Easy levels to unlock Advanced.'
                  } else if (!allIntermediateCompleted && intermediateLevels.length > 0) {
                    lockMessage = 'Complete all Intermediate levels to unlock Advanced.'
                  } else {
                    lockMessage = 'Score 16+ on the prerequisite test to unlock Advanced.'
                  }
                } else {
                  lockMessage = 'Score 16+ on the prerequisite test to unlock Advanced.'
                }
              }
            }
            
            const buttonLabel = isLocked
              ? '🔒 Locked'
              : isDone
                ? 'REVIEW LEVEL'
                : 'START LEVEL'
            const buttonVariant = isLocked
              ? 'btn-secondary'
              : isDone
                ? 'btn-completed'
                : 'btn-neon'

            return (
              <div key={lvl.id} className="col-12 col-md-6">
                <Motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className={`level-card card-glow p-4 ${isLocked ? 'opacity-50' : ''}`}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h3 className="h4 fw-bold mb-1">{lvl.title}</h3>
                      <p className="text-muted mb-0"><strong>Reward: Up to {lvl.xp} XP</strong></p>
                      {isLocked && (
                        <span className="badge bg-warning text-dark mt-2">
                          🔒 {lockMessage}
                        </span>
                      )}
                    </div>
                    {isDone && (
                      <span className="badge bg-success text-dark px-3 py-2">COMPLETED</span>
                    )}
                  </div>

                  <div className="text-end">
                    <button
                      disabled={isLocked}
                      onClick={() => startLevel(lvl)}
                      className={`btn ${buttonVariant} px-4 py-2`}
                    >
                      {buttonLabel}
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