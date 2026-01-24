// src/components/AdminRoute.jsx - NEW FILE

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../state/useAuth'

export default function AdminRoute({ children }) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <div className="text-center text-white p-5">Checking permissions...</div>
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  // Check for the 'admin' role
  if (currentUser.role !== 'admin') {
    alert('Access Denied: Admin privileges required.')
    return <Navigate to="/home" replace /> // Redirect non-admins
  }

  return children
}