import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProfileMenu from '../components/ProfileMenu.jsx'
import { useApp } from '../hooks/useApp'
import { useAuth } from '../state/useAuth'

export default function Leaderboard() {
  const navigate = useNavigate()
  const { state } = useApp()
  const { currentUser } = useAuth()
  const [leaders, setLeaders] = useState([])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }

    try {
      const results = []
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i)
        if (!key || !key.startsWith('codehub_app_state_')) {
          continue
        }

        const raw = localStorage.getItem(key)
        if (!raw) continue

        try {
          const snapshot = JSON.parse(raw)
          const xpByLanguage = snapshot?.xpByLanguage || {}
          const totalXP = Object.values(xpByLanguage).reduce(
            (sum, value) => sum + (Number(value) || 0),
            0
          )

          // Skip users with zero progress to keep board clean
          if (totalXP <= 0) {
            continue
          }

          const profile = snapshot?.profile || {}
          const displayName =
            (profile.name && profile.name.trim()) ||
            snapshot?.authDisplayName ||
            snapshot?.authEmail?.split?.('@')?.[0] ||
            'Anonymous Coder'

          const userId = key.replace('codehub_app_state_', '')

          results.push({
            userId,
            displayName,
            totalXP,
            languages: Object.entries(xpByLanguage)
              .map(([lang, xp]) => ({
                lang,
                xp: Number(xp) || 0,
              }))
              .sort((a, b) => b.xp - a.xp),
          })
        } catch (error) {
          console.warn('Unable to parse leaderboard entry for key', key, error)
        }
      }

      results.sort((a, b) => b.totalXP - a.totalXP)
      setLeaders(results)
    } catch (error) {
      console.error('Failed to build leaderboard:', error)
      setLeaders([])
    }
  }, [state, currentUser?.uid])

  const totalXPOnServer = useMemo(
    () => leaders.reduce((sum, entry) => sum + entry.totalXP, 0),
    [leaders]
  )

  return (
    <div className="gradient-bg" style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/languages')}
            className="btn btn-outline-light"
            title="Back to Languages"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ whiteSpace: 'nowrap' }}
          >
            ← Back to Languages
          </motion.button>

          <motion.h1
            className="neon-text display-5 fw-bold mb-0"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Global Leaderboard
          </motion.h1>

          <div className="ms-auto">
            <ProfileMenu />
          </div>
        </div>

        <motion.div
          className="card-glow mb-5 p-4"
          style={{ backgroundColor: '#151a2d', borderRadius: '16px' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h3 className="text-light mb-1">Hall of Fame</h3>
              <p className="text-muted mb-0">
                Track the top performers across every language. Earn more XP to climb the ranks!
              </p>
            </div>
            <div className="text-end">
              <p className="text-light mb-1 fw-semibold">
                Total XP Recorded: <span className="text-info">{totalXPOnServer}</span>
              </p>
              <p className="text-muted mb-0 small">
                Showing {leaders.length} active {leaders.length === 1 ? 'player' : 'players'}
              </p>
            </div>
          </div>
        </motion.div>

        {leaders.length === 0 ? (
          <motion.div
            className="card-glow p-5 text-center mx-auto"
            style={{ maxWidth: '640px', backgroundColor: '#151a2d', borderRadius: '14px' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-light mb-3">No progress yet.</h4>
            <p className="text-muted mb-4">
              Complete levels to start appearing on the leaderboard. Every XP point counts!
            </p>
            <button
              onClick={() => navigate('/languages')}
              className="btn btn-neon px-4 py-3"
            >
              Start Learning
            </button>
          </motion.div>
        ) : (
          <div className="row g-4">
            {leaders.map((entry, index) => {
              const isCurrentUser =
                (currentUser?.uid && entry.userId === currentUser.uid) ||
                (!currentUser?.uid && entry.userId.endsWith('guest'))

              const rank = index + 1
              const medal =
                rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`

              return (
                <div key={entry.userId} className="col-12">
                  <motion.div
                    className="card-glow p-4 d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center"
                    style={{
                      background: isCurrentUser
                        ? 'linear-gradient(135deg, rgba(76,201,240,0.18), rgba(92,107,255,0.22))'
                        : '#151a2d',
                      borderRadius: '18px',
                      border: isCurrentUser
                        ? '1px solid rgba(76, 201, 240, 0.55)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-between w-100 gap-3 flex-wrap"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <span
                          className="badge rounded-pill px-3 py-2 fs-5"
                          style={{
                            background:
                              rank === 1
                                ? 'linear-gradient(135deg, #facc15, #f97316)'
                                : rank === 2
                                ? 'linear-gradient(135deg, #cbd5f5, #94a3b8)'
                                : rank === 3
                                ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                                : 'rgba(255, 255, 255, 0.08)',
                            color: rank <= 3 ? '#111' : '#cbd5f5',
                          }}
                        >
                          {medal}
                        </span>
                        <div>
                          <h4 className="text-light mb-1">
                            {entry.displayName}
                            {isCurrentUser && (
                              <span className="badge bg-info text-dark ms-2">You</span>
                            )}
                          </h4>
                          <p className="text-muted mb-0 small">
                            Total XP: <span className="text-info fw-semibold">{entry.totalXP}</span>
                          </p>
                        </div>
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {entry.languages.map(({ lang, xp }) => (
                          <span
                            key={lang}
                            className="badge px-3 py-2"
                            style={{
                              backgroundColor: 'rgba(92, 107, 255, 0.18)',
                              border: '1px solid rgba(92, 107, 255, 0.35)',
                              color: '#c5d7ff',
                              fontWeight: 600,
                            }}
                          >
                            {lang.toUpperCase()}: {xp} XP
                          </span>
                        ))}
                        {entry.languages.length === 0 && (
                          <span className="badge bg-secondary">No XP recorded</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

