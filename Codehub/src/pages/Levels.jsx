// src/pages/Levels.jsx (COMPLETE CODE)

import { useMemo, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { useApp } from '../hooks/useApp'
import ProfileMenu from '../components/ProfileMenu.jsx'
import PrerequisiteTest from '../components/PrerequisiteTest'
import { quizApi } from '../utils/quiz/api'


export default function Levels() {
  const { lang } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()

  const [levels, setLevels] = useState([])
  const [loadingLevels, setLoadingLevels] = useState(true)
  const [levelsError, setLevelsError] = useState(null)

  // Debug logging
  console.log('Levels component - lang:', lang, 'state:', state)

  // Check if prerequisite test is completed
  const prerequisiteResult = state.prerequisiteTests?.[lang]
  const hasCompletedPrerequisite = prerequisiteResult?.completed === true
  const unlockedDifficulty = prerequisiteResult?.unlockedDifficulty || 'easy'

  // Load levels from backend (MongoDB) for this language
  // ALWAYS fetch lessons regardless of prerequisite status
  useEffect(() => {
    let isMounted = true

    const fetchLevels = async () => {
      try {
        setLoadingLevels(true)
        setLevelsError(null)

        const apiUrl = `/lessons?languageKey=${lang}`
        const fullUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}${apiUrl}`
        console.log('[Levels] Fetching lessons for languageKey:', lang)
        console.log('[Levels] Full API URL:', fullUrl)
        
        const data = await quizApi.get(apiUrl)
        console.log('[Levels] Raw API response:', data)
        console.log('[Levels] Response type:', typeof data, 'Is array?', Array.isArray(data))
        console.log('[Levels] Received lessons data:', data?.length || 0, 'lessons')

        if (!isMounted) return

        if (!Array.isArray(data)) {
          console.warn('[Levels] API did not return an array:', data)
          setLevels([])
          setLevelsError('Invalid response format from server')
          return
        }

        const normalized = data.map(lesson => {
          console.log('[Levels] Processing lesson:', lesson._id, lesson.title, 'levelNumber:', lesson.levelNumber)
          return {
            id: lesson._id,
            title: lesson.title || lesson.lessonTitle || 'Untitled Level',
            xp: typeof lesson.xp === 'number' ? lesson.xp : 0,
            difficulty: lesson.difficulty || 'intermediate',
            order: typeof lesson.order === 'number' ? lesson.order : lesson.levelNumber || 999,
          }
        })

        console.log('[Levels] Normalized lessons:', normalized.length, normalized)
        if (isMounted) {
          setLevels(normalized)
        }
      } catch (error) {
        console.error('[Levels] Error loading levels from API:', error)
        console.error('[Levels] Error details:', error.message)
        if (error.message) {
          console.error('[Levels] Error message:', error.message)
        }
        if (isMounted) {
          setLevelsError(`Failed to load levels: ${error.message || 'Unknown error'}`)
          setLevels([])
        }
      } finally {
        if (isMounted) {
          setLoadingLevels(false)
        }
      }
    }

    fetchLevels()

    return () => {
      isMounted = false
    }
  }, [lang, hasCompletedPrerequisite]) // Refetch when prerequisite status changes

  console.log('[Levels] Prerequisite check - hasCompleted:', hasCompletedPrerequisite, 'result:', prerequisiteResult, 'lang:', lang)

  // Progress calculation - define completed first
  const completed = new Set(state.levelsByLanguage[lang] || [])

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
  
  // Progress calculation (avoid NaN when totalXP is 0)
  const totalXP = levels.reduce((sum, l) => sum + l.xp, 0)
  const currentXP = state.xpByLanguage[lang] || 0
  const progress = totalXP > 0
    ? Math.min(100, Math.round((currentXP / totalXP) * 100))
    : 0

  // Navigate to the study route
  const startLevel = (level) => {
    navigate(`/study/${lang}/${level.id}`);
  };

  // Handle prerequisite test completion
  const handlePrerequisiteComplete = (score, percentage) => {
    console.log('[Levels] Prerequisite completed - score:', score, 'percentage:', percentage, 'lang:', lang)
    dispatch({
      type: 'completePrerequisiteTest',
      lang: lang,
      score: score,
      percentage: percentage
    })
    // Force a small delay to ensure state updates before re-render
    setTimeout(() => {
      console.log('[Levels] State after prerequisite completion:', state.prerequisiteTests?.[lang])
    }, 100)
  }

  // Show prerequisite test ONLY if not completed AND levels are loaded
  // This ensures we don't block the UI while loading
  if (!hasCompletedPrerequisite && !loadingLevels) {
    return (
      <PrerequisiteTest
        lang={lang}
        onComplete={handlePrerequisiteComplete}
        onExit={() => navigate('/languages')}
      />
    )
  }

  // Show loading state while fetching levels
  if (loadingLevels) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="text-center">
            <div className="spinner-border text-info mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-light">Loading levels...</p>
          </div>
        </div>
      </div>
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
        {loadingLevels ? (
          <div className="text-light">Loading levels...</div>
        ) : (
          <>
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
          </>
        )}
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
          {levelsError && (
            <div className="col-12">
              <div className="alert alert-warning">{levelsError}</div>
            </div>
          )}
          {!hasCompletedPrerequisite && (
            <div className="col-12">
              <div className="alert alert-info">
                <strong>⚠️ Prerequisite Test Required:</strong> Complete the prerequisite test to unlock levels. 
                <button 
                  onClick={() => {
                    // Re-trigger prerequisite test
                    dispatch({ type: 'RESET_STATE', payload: { ...state, prerequisiteTests: { ...state.prerequisiteTests, [lang]: undefined } } })
                  }}
                  className="btn btn-sm btn-primary ms-2"
                >
                  Start Prerequisite Test
                </button>
              </div>
            </div>
          )}
          {sortedLevels.length === 0 && !loadingLevels && (
            <div className="col-12">
              <div className="alert alert-warning text-center">
                <p>No lessons found for {lang}. Please check if lessons exist in the database.</p>
              </div>
            </div>
          )}
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