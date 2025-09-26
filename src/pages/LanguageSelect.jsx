import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext.jsx'

const LANGS = [
  { key: 'javascript', label: 'JavaScript', gradient: 'linear-gradient(135deg, #ffd23f 0%, #ff6b35 100%)' },
  { key: 'python', label: 'Python', gradient: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)' },
  { key: 'java', label: 'Java', gradient: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)' },
  { key: 'cpp', label: 'C++', gradient: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)' },
]

export default function LanguageSelect() {
  const navigate = useNavigate()
  const { dispatch } = useApp()

  const handleSelect = (key) => {
    dispatch({ type: 'selectLanguage', lang: key })
    navigate(`/levels/${key}`)
  }

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <h1 className="display-3 fw-bold neon-text mb-3">
            Choose Your Path
          </h1>
          <p className="lead text-light">Select a language to start your coding quest.</p>
        </motion.div>

        <div className="row g-4 justify-content-center">
          {LANGS.map((lang, i) => (
            <div key={lang.key} className="col-12 col-md-6 col-lg-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                onClick={() => handleSelect(lang.key)}
                className="btn w-100 language-card card-glow"
                style={{ background: lang.gradient }}
              >
                {lang.label}
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

