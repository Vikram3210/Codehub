// src/pages/TheoryQuizPage.jsx (CORRECTED IMPORTS)

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { useApp } from '../hooks/useApp' 
import { useAuth } from '../state/useAuth.js' 
import ProfileMenu from '../components/ProfileMenu.jsx'
import LevelContent from '../components/LevelContent'
import Quiz from '../components/Quiz'
import ErrorBoundary from '../components/ErrorBoundary'
import { getLevelData } from '../data/levelData'
import '../styles/TheoryQuizPage.css'


export default function TheoryQuizPage() {
  const { lang, levelId } = useParams()
  const navigate = useNavigate()
  const { dispatch, state } = useApp()

  const [step, setStep] = useState('theory') // 'theory' or 'quiz'
  const [quizScore, setQuizScore] = useState(0)
  const [quizMaxScore, setQuizMaxScore] = useState(0)

  // Get level data safely
  let levelData = null
  try {
    levelData = getLevelData(lang, levelId)
  } catch (error) {
    console.error('Error getting level data:', error)
  }
  
  // Get current total XP for this language
  const currentTotalXP = state?.xpByLanguage?.[lang] || 0

  // Debug logging
  useEffect(() => {
    console.log('=== TheoryQuizPage Debug ===')
    console.log('lang:', lang)
    console.log('levelId:', levelId)
    console.log('levelData:', levelData)
    console.log('state:', state)
    console.log('step:', step)
  }, [lang, levelId, levelData, state, step])

  // Handle case when level data is not found (check if title is "Level Not Found")
  if (!levelData || levelData.title === 'Level Not Found') {
    return (
      <div className="gradient-bg" style={{ minHeight: '100vh', padding: '2rem 0' }}>
        <div className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <button 
              onClick={() => navigate(`/levels/${lang || 'javascript'}`)}
              className="btn btn-outline-light"
              style={{ whiteSpace: 'nowrap' }}
            >
              ← Back to Levels
            </button>
            <div className="ms-auto">
              <ProfileMenu />
            </div>
          </div>
          <div className="text-center card-glow p-5 mx-auto" style={{ maxWidth: '600px', backgroundColor: '#151a2d', borderRadius: '10px' }}>
            <h2 className="neon-text mb-4">Level Not Found</h2>
            <p className="text-light mb-3">
              The level <strong>"{levelId || 'unknown'}"</strong> for <strong>{lang || 'unknown'}</strong> could not be found.
            </p>
            <div className="text-muted mb-4 small text-start" style={{ backgroundColor: '#1a1f3a', padding: '1rem', borderRadius: '8px' }}>
              <strong>Debug Info:</strong><br/>
              Language: {lang || 'undefined'}<br/>
              Level ID: {levelId || 'undefined'}<br/>
              Available languages: javascript, python, java, cpp
            </div>
            <button
              onClick={() => navigate(`/levels/${lang || 'javascript'}`)}
              className="btn btn-neon px-4 py-3"
            >
              ← Back to Levels
            </button>
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    // Set the max score when data loads
    if (levelData && levelData.xp && Array.isArray(levelData.quiz) && levelData.quiz.length > 0) {
        setQuizMaxScore(levelData.xp)
    }
  }, [levelData])

  const handleQuizComplete = (score) => {
    // Calculate XP earned safely (avoid divide-by-zero)
    const totalQuestions = Array.isArray(levelData.quiz) ? levelData.quiz.length : 0
    const percentage = totalQuestions > 0 ? (score / totalQuestions) : 0
    const xpEarned = Math.max(0, Math.round(percentage * (levelData.xp || 0)))
    
    setQuizScore(xpEarned) // Save the final earned XP

    // Dispatch the action to complete the level and add XP
    dispatch({ 
        type: 'completeLevel', 
        lang: lang, 
        levelId: levelId, 
        xp: xpEarned // Pass the dynamic XP score
    })

    setStep('complete')
  }

  const renderContent = () => {
    if (step === 'theory') {
      // Estimate reading time from theory length (words per minute ~180)
      const theoryText = typeof levelData.theory === 'string' ? levelData.theory : ''
      const words = theoryText.trim().split(/\s+/).filter(Boolean).length
      const seconds = Math.ceil((words / 180) * 60)
      const clamped = Math.min(Math.max(seconds, 30), 240) // clamp between 30s and 4m
      return (
        <ErrorBoundary>
          <LevelContent 
            title={levelData.title || 'Level Content'}
            content={levelData.theory || 'No theory content available.'}
            onNext={() => setStep('quiz')}
            nextButtonText="Start Quiz"
            readSeconds={clamped}
          />
        </ErrorBoundary>
      )
    }
    
    if (step === 'quiz') {
      // Check if quiz data exists
      if (!Array.isArray(levelData.quiz) || levelData.quiz.length === 0) {
        return (
          <div className="card-glow p-5 text-center mx-auto" style={{ maxWidth: '600px', backgroundColor: '#151a2d', borderRadius: '10px' }}>
            <h3 className="text-warning mb-3">Quiz Not Available</h3>
            <p className="text-light mb-4">No quiz questions are available for this level.</p>
            <button
              onClick={() => navigate(`/levels/${lang}`)}
              className="btn btn-neon px-4 py-3"
            >
              ← Back to Levels
            </button>
          </div>
        )
      }
      
      return (
        <Quiz 
          questions={levelData.quiz}
          onComplete={handleQuizComplete}
          maxXP={levelData.xp || 0}
        />
      )
    }

    if (step === 'complete') {
        return (
            <Motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center p-5 card-glow mx-auto completion-animation"
                style={{ maxWidth: '700px', backgroundColor: '#151a2d', borderRadius: '15px' }}
            >
                {/* Success Animation */}
                <Motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="mb-4"
                >
                    <h2 className="neon-text display-3 mb-3">🎉 Level Complete! 🎉</h2>
                </Motion.div>

                {/* XP Display */}
                <Motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="xp-display mb-4 p-4"
                    style={{ 
                        background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                        borderRadius: '10px',
                        border: '2px solid #ffc107'
                    }}
                >
                    <h3 className="text-dark mb-2" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        XP Earned
                    </h3>
                    <Motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                        className="xp-gain"
                        style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1a1a1a' }}
                    >
                        +{quizScore} XP
                    </Motion.div>
                    <p className="text-dark mb-0" style={{ fontSize: '1.1rem' }}>
                        Great job completing <strong>{levelData.title}</strong>!
                    </p>
                </Motion.div>

                {/* Progress Info */}
                <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="mb-4"
                >
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <div className="p-3" style={{ backgroundColor: '#1a1f3a', borderRadius: '8px' }}>
                                <h6 className="text-light mb-1">Quiz Performance</h6>
                                <p className="text-success mb-0" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    {levelData.xp > 0 ? Math.round((quizScore / levelData.xp) * 100) : 0}% correct
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="p-3" style={{ backgroundColor: '#1a1f3a', borderRadius: '8px' }}>
                                <h6 className="text-light mb-1">Total {lang.charAt(0).toUpperCase() + lang.slice(1)} XP</h6>
                                <p className="text-info mb-0" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    {currentTotalXP + quizScore} XP
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="text-muted mb-0">
                        Maximum possible XP for this level: {levelData.xp} XP
                    </p>
                </Motion.div>

                {/* Action Buttons */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="d-flex gap-3 justify-content-center flex-wrap"
                >
                <button
                    onClick={() => navigate(`/levels/${lang}`)}
                        className="btn btn-neon px-4 py-3"
                        style={{ fontSize: '1.1rem' }}
                    >
                        📚 Return to Levels
                    </button>
                    <button
                        onClick={() => {
                            setStep('theory');
                            setQuizScore(0);
                        }}
                        className="btn btn-outline-light px-4 py-3"
                        style={{ fontSize: '1.1rem' }}
                    >
                        🔄 Retake Level
                </button>
                </Motion.div>
            </Motion.div>
        )
    }

    return null
  }

  return (
    <div className="gradient-bg" style={{ minHeight: '100vh', padding: '2rem 0' }}>
    <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <Motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/levels/${lang}`)}
            className="btn btn-outline-light"
            title="Back to Levels"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ whiteSpace: 'nowrap' }}
          >
            ← Back to {lang?.charAt(0).toUpperCase() + lang?.slice(1)} Levels
          </Motion.button>
          <div className="ms-auto">
        <ProfileMenu />
          </div>
      </div>
      
        <ErrorBoundary>
          {renderContent() || (
            <div className="card-glow p-5 text-center mx-auto" style={{ maxWidth: '600px', backgroundColor: '#151a2d', borderRadius: '10px' }}>
              <h3 className="text-warning mb-3">Loading Content...</h3>
              <p className="text-light mb-3">Please wait while we load the content.</p>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </ErrorBoundary>

      <div className="text-center mt-5">
        <p className="text-muted">
          Current Step: {step === 'theory' ? 'Theory Review' : step === 'quiz' ? 'Quiz Time' : 'Completed'}
        </p>
        </div>
      </div>
    </div>
  )
}