// src/pages/Register.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthContainer from '../components/AuthContainer'
import { register } from '../services/firebase'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('') 
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!passwordRegex.test(password)) {
      setError('Password must be min 6 chars, 1 upper, 1 lower, 1 digit, 1 special.')
      return
    }

    setIsLoading(true)

    try {
      await register(email, password, username)

      alert('Registration successful! Please check your email to verify your account before logging in.')
      // *** CRITICAL: Navigate to login so user can verify email and then log in. ***
      navigate('/login') 
    } catch (err) {
      let errorMessage = err.message || 'Registration failed.'
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Try logging in.'
      }
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <AuthContainer title="Register New Account" subtitle="Join the CodeHub community to level up your skills.">
      {error && <div className="alert alert-danger mb-4 py-2" style={{ backgroundColor: '#ff333330', borderColor: '#ff3333' }}>{error}</div>}
      
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control form-control-custom py-2"
            placeholder="Username"
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control form-control-custom py-2"
            placeholder="Email"
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control form-control-custom py-2"
            placeholder="Password"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-control form-control-custom py-2"
            placeholder="Confirm Password"
            required
          />
          <small className="form-text text-light-50">
            Min 6 chars, 1 upper, 1 lower, 1 digit, 1 special
          </small>
        </div>

        <button
          type="submit"
          className="btn btn-neon w-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          ) : (
            '🚀 REGISTER NOW'
          )}
        </button>
      </form>
      
      <div className="text-center mt-4">
        <span className="text-light-50">Already have an account? </span>
        <Link 
          to="/login" 
          className="text-decoration-none" 
          style={{ color: 'var(--color-accent-cyan)' }}
        >
          SIGN IN
        </Link>
      </div>
    </AuthContainer>
  )
}