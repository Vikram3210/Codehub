// src/state/AppContext.jsx (COMPLETE CODE)

import { createContext, useContext, useMemo, useReducer, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'

const initialState = {
  selectedLanguage: null,
  // xpByLanguage stores the total XP earned for a given language (e.g., { javascript: 150, python: 80 })
  xpByLanguage: {},
  // levelsByLanguage stores arrays of completed level IDs (e.g., { javascript: ['js_01', 'js_02'] })
  levelsByLanguage: {},
  // prerequisiteTests stores test results by language (e.g., { javascript: { score: 18, percentage: 90, unlockedDifficulty: 'advanced' } })
  prerequisiteTests: {},
  profile: {
    name: '',
    avatarUrl: '',
    bio: '',
  },
}

// Get storage key for current user
function getStorageKey(userId) {
  if (!userId) return 'codehub_app_state_guest'
  return `codehub_app_state_${userId}`
}

function loadState(userId) {
  try {
    const storageKey = getStorageKey(userId)
    const raw = localStorage.getItem(storageKey)
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState
  } catch {
    return initialState
  }
}

// Function to clear user progress when a new user logs in
export function clearUserProgress(userId, options = {}) {
  try {
    // Clear old generic key (for backwards compatibility)
    localStorage.removeItem('codehub_app_state')
    
    // Clear user-specific key if userId provided
    if (userId) {
      const storageKey = getStorageKey(userId)
      localStorage.removeItem(storageKey)
    }
    
    // Optionally remove all user keys if explicitly requested
    if (options.removeAllUserKeys) {
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('codehub_app_state_')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    }
    
    return initialState
  } catch (error) {
    console.error('Error clearing user progress:', error)
    return initialState
  }
}

function saveState(state, userId) {
  try {
    const storageKey = getStorageKey(userId)
    localStorage.setItem(storageKey, JSON.stringify(state))
  } catch (error) {
    console.error('Error saving state:', error)
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'RESET_STATE':
      return action.payload || initialState
    
    case 'selectLanguage':
      return { ...state, selectedLanguage: action.lang }
    
    // NOTE: 'gainXP' is now obsolete, as 'completeLevel' handles XP gain.
    case 'gainXP': {
      const current = state.xpByLanguage[action.lang] || 0
      return {
        ...state,
        xpByLanguage: { ...state.xpByLanguage, [action.lang]: current + action.amount },
      }
    }
    
    case 'completeLevel': {
      const doneSet = new Set(state.levelsByLanguage[action.lang] || [])
      
      // CRITICAL: Prevent re-completion and re-adding XP
      if (doneSet.has(action.levelId)) {
          return state
      }
      
      doneSet.add(action.levelId)
      
      const currentXP = state.xpByLanguage[action.lang] || 0
      
      // CRITICAL: Add the XP score passed from the Quiz component (action.xp)
      return {
        ...state,
        xpByLanguage: { 
            ...state.xpByLanguage, 
            [action.lang]: currentXP + action.xp // Use the dynamic XP score from the quiz
        },
        levelsByLanguage: { 
            ...state.levelsByLanguage, 
            [action.lang]: Array.from(doneSet) 
        },
      }
    }
    
    case 'updateProfile':
      return { ...state, profile: { ...state.profile, ...action.payload } }
    
    case 'completePrerequisiteTest':
      const unlockedDifficulty = action.score > 15 ? 'advanced' : action.score > 13 ? 'intermediate' : 'easy'
      return {
        ...state,
        prerequisiteTests: {
          ...state.prerequisiteTests,
          [action.lang]: {
            score: action.score,
            percentage: action.percentage,
            unlockedDifficulty,
            completed: true
          }
        }
      }
      
    default:
      return state
  }
}

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Get current user from auth context (using useContext directly to avoid circular dependency)
  const authContext = useContext(AuthContext)
  const currentUserId = authContext?.currentUser?.uid || null
  const [lastUserId, setLastUserId] = useState(currentUserId)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize state from local storage for current user
  const [state, dispatch] = useReducer(
    reducer, 
    null, 
    () => {
      const initialData = loadState(currentUserId)
      setIsInitialized(true)
      return initialData
    }
  )

  // Reset state when user changes
  useEffect(() => {
    if (!isInitialized) return
    
    if (currentUserId !== lastUserId) {
      console.log('User changed from', lastUserId, 'to', currentUserId)
      
      // Clear old user's progress from memory
      if (lastUserId) {
        console.log('Clearing progress for previous user:', lastUserId)
      }
      
      // Load state for the new user (this will be empty for new users)
      const newState = loadState(currentUserId)
      console.log('Loading state for new user:', currentUserId, newState)
      
      // Reset state to load new user's data
      dispatch({ type: 'RESET_STATE', payload: newState })
      
      // Update lastUserId
      setLastUserId(currentUserId)
    }
  }, [currentUserId, lastUserId, isInitialized])

  // Save state to local storage whenever it changes
  useEffect(() => {
    saveState(state, currentUserId)
  }, [state, currentUserId])

  const contextValue = useMemo(() => ({ state, dispatch }), [state])

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}