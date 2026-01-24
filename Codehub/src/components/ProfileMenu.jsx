// src/components/ProfileMenu.jsx
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion' // <-- CORRECTED IMPORT
import { useApp } from '../hooks/useApp' // Assuming this hook provides state and dispatch

export default function ProfileMenu() {
  const { state, dispatch } = useApp()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(() => {
    // Initialize form from state.profile, ensuring all fields exist
    const profile = state?.profile || {}
    return {
      name: profile.name || '',
      avatarUrl: profile.avatarUrl || '',
      bio: profile.bio || ''
    }
  })
  
  // Update form when modal opens to reflect current state
  useEffect(() => {
    if (open && state?.profile) {
      setForm({
        name: state.profile.name || '',
        avatarUrl: state.profile.avatarUrl || '',
        bio: state.profile.bio || ''
      })
    }
  }, [open, state?.profile])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const originalOverflow = document.body.style.overflow
      if (open) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = originalOverflow || ''
      }
      return () => {
        document.body.style.overflow = originalOverflow || ''
      }
    }
  }, [open])

  const onSave = () => {
    try {
      // Validate form data
      if (!form.name || form.name.trim() === '') {
        alert('Please enter a name')
        return
      }
      
      // Dispatch update with trimmed values
      dispatch({ 
        type: 'updateProfile', 
        payload: {
          name: form.name.trim(),
          avatarUrl: form.avatarUrl.trim(),
          bio: form.bio.trim()
        }
      })
      setOpen(false)
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    }
  }

  return (
    <div className="position-relative">
      <button
        onClick={() => {
          // Update form with current profile data when opening
          const profile = state?.profile || {}
          setForm({
            name: profile.name || '',
            avatarUrl: profile.avatarUrl || '',
            bio: profile.bio || ''
          })
          setOpen(true)
        }}
        className="profile-button card-glow"
        title="Profile"
      >
        {state?.profile?.name ? state.profile.name[0]?.toUpperCase() : 'P'}
      </button>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Solid opaque background layer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="position-fixed top-0 start-0 w-100 h-100"
                style={{ 
                  backgroundColor: '#040612',
                  zIndex: 99998,
                  pointerEvents: 'auto'
                }}
              />
              {/* Blurred backdrop layer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setOpen(false)
                  }
                }}
                className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ 
                  backgroundColor: 'rgba(4, 6, 18, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  zIndex: 99999,
                  pointerEvents: 'auto'
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: -50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="card-glow p-4 mx-3"
                  style={{ 
                    maxWidth: '450px', 
                    width: '100%', 
                    zIndex: 100000, 
                    position: 'relative',
                    backgroundColor: '#151a2d',
                    pointerEvents: 'auto',
                    boxShadow: '0 0 30px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  <h4 className="neon-text mb-4">Edit Profile</h4>
                  
                  <div className="mb-3">
                    <label className="form-label text-light">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="form-control form-control-custom"
                      placeholder="Your Coder Name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-light">Avatar URL</label>
                    <input
                      type="url"
                      value={form.avatarUrl}
                      onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                      className="form-control form-control-custom"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-light">Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      className="form-control form-control-custom"
                      rows={3}
                      placeholder="I code to level up!"
                    />
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-logout px-3 py-2"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-neon px-3 py-2"
                      onClick={onSave}
                      disabled={!form.name} 
                    >
                      Save
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}