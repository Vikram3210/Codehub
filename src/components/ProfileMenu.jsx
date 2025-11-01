// src/components/ProfileMenu.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // <-- CORRECTED IMPORT
import { useApp } from '../hooks/useApp' // Assuming this hook provides state and dispatch

export default function ProfileMenu() {
  const { state, dispatch } = useApp()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(state.profile || { name: '', avatarUrl: '', bio: '' })

  const onSave = () => {
    dispatch({ type: 'updateProfile', payload: form })
    setOpen(false)
  }

  return (
    <div className="position-relative">
      <button
        onClick={() => {
          setForm(state.profile || { name: '', avatarUrl: '', bio: '' })
          setOpen(true)
        }}
        className="profile-button card-glow"
        title="Profile"
      >
        {state.profile?.name ? state.profile.name[0]?.toUpperCase() : 'P'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div // <-- CORRECTED USAGE
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
          >
            <motion.div // <-- CORRECTED USAGE
              initial={{ scale: 0.8, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="card-glow p-4 mx-3"
              style={{ maxWidth: '450px', width: '100%', zIndex: 1060 }}
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
        )}
      </AnimatePresence>
    </div>
  )
}