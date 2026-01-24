// src/components/ProtectedRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../state/useAuth'

export default function ProtectedRoute({ children }) {
  // CRITICAL: Destructure 'loading' from useAuth()
  const { currentUser, loading } = useAuth() 

  // 1. If still loading, return null (or a spinner) and wait.
  if (loading) {
    return (
      <div className="gradient-bg d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="card-glow p-4 text-center" style={{ backgroundColor: '#151a2d', borderRadius: '10px' }}>
          <h2 className="neon-text mb-2">Loading...</h2>
          <p className="text-muted mb-0">Preparing your learning session</p>
        </div>
      </div>
    ); 
  }

  // 2. If NOT loading AND no user, redirect to login.
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  // 3. If NOT loading AND there is a user, render the protected component.
  return children
}