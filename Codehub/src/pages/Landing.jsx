// src/pages/Landing.jsx (FIXED)
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../components/Logo'
import { useAuth } from '../state/useAuth'

export default function Landing() {
  const navigate = useNavigate()
  const { currentUser, loading } = useAuth() // CRITICAL: Get currentUser and loading

  useEffect(() => {
    // 1. If not loading AND we have a user, go to practice page
    if (!loading && currentUser) {
      navigate('/practice', { replace: true })
    } 
    // 2. If not loading AND no user, show the start button/login button
    // The component will just render the button if neither of the above is true.
    
    // REMOVED: The 3000ms timer that was causing the loop
  }, [currentUser, loading, navigate])

  const handleStart = () => {
    // Manually navigate to login
    navigate('/login')
  }

  // If loading, the AuthProvider component should handle the 'Authenticating...' screen.
  if (loading) return null; 

  return (
    <div className="gradient-bg min-vh-100 d-flex align-items-center justify-content-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, type: 'spring', damping: 10 }}
        className="text-center"
      >
        <Logo size={150} />
        
        {/* CRITICAL: Add a button to start the flow */}
        <motion.button
          onClick={handleStart}
          className="btn btn-neon btn-lg mt-5"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          START CODING NOW 🚀
        </motion.button>
      </motion.div>
    </div>
  )
}