// src/state/AuthContext.jsx (FIXED)
import { createContext, useState, useEffect } from 'react'
import { auth } from '../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { clearUserProgress } from './AppContext'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [previousUser, setPreviousUser] = useState(null)

  useEffect(() => {
    // Set a timeout to stop loading after 5 seconds if Firebase doesn't respond
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 5000)
    
    // Firebase listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeout) 
      
      // Check if this is a different user logging in
      if (user && previousUser && user.uid !== previousUser.uid) {
        // Clear previous user's progress when a new user logs in
        clearUserProgress()
      }
      
      setCurrentUser(user)
      setPreviousUser(user)
      setLoading(false)
    })
    
    return () => {
      unsubscribe()
      clearTimeout(timeout)
    }
  }, [previousUser])

  const value = {
    currentUser,
    loading,
  }

  // Use a loading screen while checking initial auth status
  if (loading) {
    return (
      <div className="gradient-bg d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <h1 className="neon-text">Authenticating...</h1>
      </div>
    )
  }

  // Once loading is false, render the children (your entire App)
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}