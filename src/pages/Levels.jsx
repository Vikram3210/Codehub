import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../state/AppContext.jsx'
import ProfileMenu from '../components/ProfileMenu.jsx'

const DEFAULT_LEVELS = [
  { id: '1', title: 'Level 1: Basics', xp: 50 },
  { id: '2', title: 'Level 2: Control Flow', xp: 75 },
  { id: '3', title: 'Level 3: Data Structures', xp: 100 },
  { id: '4', title: 'Level 4: Algorithms', xp: 125 },
]

export default function Levels() {
  const { lang } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()

  const levels = useMemo(() => DEFAULT_LEVELS, [lang])
  const completed = new Set(state.levelsByLanguage[lang] || [])
  const totalXP = levels.reduce((sum, l) => sum + l.xp, 0)
  const currentXP = state.xpByLanguage[lang] || 0
  const progress = Math.min(100, Math.round((currentXP / totalXP) * 100))

  const completeLevel = (level) => {
    if (completed.has(level.id)) return
    dispatch({ type: 'completeLevel', lang, levelId: level.id })
    dispatch({ type: 'gainXP', lang, amount: level.xp })
  }

  const onBack = () => navigate('/languages')

  return (
    <div className="container-fluid min-vh-100 py-4">
      <div className="container">
        {/* Header */}
        <div className="row align-items-center mb-4">
          <div className="col">
            <button onClick={onBack} className="btn btn-link text-light p-0">
              ← Back to Languages
            </button>
          </div>
          <div className="col-auto">
            <div className="d-flex align-items-center gap-3">
              <div className="text-end d-none d-md-block">
                <div className="small text-muted">XP</div>
                <div className="fw-bold text-info">{currentXP} / {totalXP}</div>
              </div>
              <ProfileMenu />
            </div>
          </div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <h1 className="display-4 fw-bold neon-text">
            {lang?.toUpperCase()} Quest
          </h1>
        </motion.div>

        {/* Progress Bar */}
        <div className="row justify-content-center mb-5">
          <div className="col-12 col-md-8">
            <div className="progress" style={{ height: '20px', borderRadius: '10px' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: progress + '%' }}
                transition={{ duration: 0.8 }}
                className="progress-bar progress-bar-custom"
                role="progressbar"
                style={{ width: progress + '%' }}
              />
            </div>
            <div className="d-flex justify-content-between mt-2 small text-muted">
              <span>{currentXP} XP</span>
              <span>{progress}%</span>
              <span>{totalXP} XP</span>
            </div>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="row g-4">
          {levels.map((lvl, i) => {
            const isDone = completed.has(lvl.id)
            return (
              <div key={lvl.id} className="col-12 col-md-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`level-card card-glow ${isDone ? 'opacity-75' : ''}`}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h3 className="h4 fw-bold mb-1">{lvl.title}</h3>
                      <p className="text-muted mb-0">Reward: {lvl.xp} XP</p>
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
                      onClick={() => completeLevel(lvl)}
                      className={`btn ${isDone ? 'btn-completed' : 'btn-neon'} px-4 py-2`}
                    >
                      {isDone ? 'Completed' : 'Complete Level'}
                    </button>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


