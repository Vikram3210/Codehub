// src/pages/LessonDetail.jsx - NEW FILE

import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import ProfileMenu from '../components/ProfileMenu'
// import { useAuth } from '../state/AuthContext' // Not strictly needed for the view, but good practice

// Mock Lesson Data - Replace with a Firestore fetch later
const mockLesson = {
  id: 'js-variables',
  title: '1. Variables and Data Types in JavaScript',
  content: 
    '## Theory\nVariables are containers for data. JavaScript uses `let` and `const` for modern declarations.\n\n## Example\n```javascript\nconst x = 10; \nlet message = "Hello CodeHub"; \n```\n\n**Task:** Proceed to the quiz to test your knowledge on this topic.',
  xpReward: 50,
  nextQuizId: 'js-q-1', 
}

export default function LessonDetail() {
  const { lang } = useParams() // Get language from URL
  const navigate = useNavigate()
  const lesson = mockLesson; // Replace with state/API call: useState(null)

  const handleComplete = () => {
    // ⚠️ TODO: Implement save lesson completion and XP gain to Firestore here.
    
    // Navigate to the next Quiz
    navigate(`/quiz/${lang}/${lesson.nextQuizId}`)
  }

  return (
    <div className="container py-5">
      <header className="d-flex justify-content-between align-items-center mb-5">
        <button onClick={() => navigate(`/levels/${lang}`)} className="btn btn-logout">
          &larr; Back to Levels
        </button>
        <ProfileMenu />
      </header>
      
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-glow p-4 p-md-5 text-start"
      >
        <h1 className="neon-text fw-bold mb-4">{lesson.title}</h1>
        <hr className="mb-4" />
        
        {/* Simple content rendering. Use a markdown parser (e.g., react-markdown) for production. */}
        <pre className="text-light p-3 rounded" style={{ backgroundColor: '#1e2439', borderLeft: '3px solid #00eaff', whiteSpace: 'pre-wrap' }}>
          {lesson.content}
        </pre>

        <div className="text-end mt-5">
          <button 
            onClick={handleComplete} 
            className="btn btn-neon px-5 py-3"
          >
            Go to Quiz (Earn {lesson.xpReward} XP) ➡️
          </button>
        </div>

      </Motion.div>
    </div>
  )
}