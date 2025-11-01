// src/state/AppContext.jsx (COMPLETE CODE)

import { createContext, useContext, useMemo, useReducer, useEffect } from 'react'

const initialState = {
  selectedLanguage: null,
  // xpByLanguage stores the total XP earned for a given language (e.g., { javascript: 150, python: 80 })
  xpByLanguage: {},
  // levelsByLanguage stores arrays of completed level IDs (e.g., { javascript: ['js_01', 'js_02'] })
  levelsByLanguage: {},
  profile: {
    name: '',
    avatarUrl: '',
    bio: '',
  },
}

function loadState() {
  try {
    // Load state from local storage if available
    const raw = localStorage.getItem('codehub_app_state')
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState
  } catch {
    return initialState
  }
}

// Function to clear user progress when a new user logs in
export function clearUserProgress() {
  try {
    localStorage.removeItem('codehub_app_state')
    return initialState
  } catch {
    return initialState
  }
}

function saveState(state) {
  try {
    // Save state to local storage
    localStorage.setItem('codehub_app_state', JSON.stringify(state))
  } catch {}
}

function reducer(state, action) {
  switch (action.type) {
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
      
    default:
      return state
  }
}

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Initialize state from local storage
  const [state, dispatch] = useReducer(reducer, null, loadState)

  // Save state to local storage whenever it changes
  useEffect(() => {
    saveState(state)
  }, [state])

  const contextValue = useMemo(() => ({ state, dispatch }), [state])

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}