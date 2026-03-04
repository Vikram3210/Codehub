import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../state/AppContext.jsx'

export default function ProfileMenu() {
  const { state, dispatch } = useApp()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(state.profile)

  const onSave = () => {
    dispatch({ type: 'updateProfile', payload: form })
    setOpen(false)
  }

  return (
    <div className="position-relative">
      <button
        onClick={() => setOpen(true)}
        className="profile-button card-glow"
        title="Profile"
      >
        {state.profile?.name ? state.profile.name[0]?.toUpperCase() : 'P'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="modal-content-custom p-4 w-100 mx-3"
              style={{ maxWidth: '500px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="h3 fw-bold mb-4">Your Profile</h3>
              
              <div className="mb-3">
                <label className="form-label text-light">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="form-control form-control-custom"
                  placeholder="Player One"
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
                  className="btn btn-secondary-custom px-3 py-2" 
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary px-3 py-2" 
                  style={{ background: '#00eaff', color: '#0b1020', border: 'none' }}
                  onClick={onSave}
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

