// src/pages/Quiz.jsx - NEW FILE

import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import ProfileMenu from '../components/ProfileMenu'

export default function Quiz() {
  const { lang, quizId } = useParams()
  const navigate = useNavigate()

  const handleSubmitQuiz = () => {
    // ⚠️ TODO: Implement scoring, feedback, and XP/progress update (Objective 1.3, 1.5)
    
    alert('Quiz submitted! Progress and XP updated.')
    navigate(`/levels/${lang}`) // Go back to levels page after quiz
  }

  return (
    <div className="container py-5">
      <header className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="neon-text display-6">Quiz: {quizId} ({lang.toUpperCase()})</h1>
        <ProfileMenu />
      </header>
      
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-glow p-4 p-md-5 text-start"
      >
        <h2 className="text-light mb-4">Assessment: Variables & Types</h2>
        
        <p className="lead text-warning">
          **THIS IS A PLACEHOLDER.**
          <br />
          Here you will add the quiz questions, options, and submission logic.
        </p>
        
        {/* Quiz Questions Placeholder */}
        <div className="mt-5">
            <h5 className="text-light">Q1: Which keyword declares a constant variable in JavaScript?</h5>
            <div className="form-check text-light">
                <input className="form-check-input" type="radio" name="q1" id="q1a" />
                <label className="form-check-label" htmlFor="q1a">let</label>
            </div>
            <div className="form-check text-light">
                <input className="form-check-input" type="radio" name="q1" id="q1b" />
                <label className="form-check-label" htmlFor="q1b">const</label>
            </div>
        </div>

        <div className="text-end mt-5">
          <button 
            onClick={handleSubmitQuiz} 
            className="btn btn-neon px-5 py-3"
          >
            Submit Quiz & Get Score 🏆
          </button>
        </div>
      </Motion.div>
    </div>
  )
}