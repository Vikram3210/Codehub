import { createContext, useContext, useMemo, useReducer, useEffect } from 'react'

const initialState = {
  selectedLanguage: null,
  xpByLanguage: {},
  levelsByLanguage: {},
  profile: {
    name: '',
    avatarUrl: '',
    bio: '',
  },
}

function loadState() {
  try {
    const raw = localStorage.getItem('codehub_app_state')
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState
  } catch {
    return initialState
  }
}

function saveState(state) {
  try {
    localStorage.setItem('codehub_app_state', JSON.stringify(state))
  } catch {}
}

function reducer(state, action) {
  switch (action.type) {
    case 'selectLanguage':
      return { ...state, selectedLanguage: action.lang }
    case 'gainXP': {
      const current = state.xpByLanguage[action.lang] || 0
      return {
        ...state,
        xpByLanguage: { ...state.xpByLanguage, [action.lang]: current + action.amount },
      }
    }
    case 'completeLevel': {
      const doneSet = new Set(state.levelsByLanguage[action.lang] || [])
      doneSet.add(action.levelId)
      return {
        ...state,
        levelsByLanguage: { ...state.levelsByLanguage, [action.lang]: Array.from(doneSet) },
      }
    }
    case 'updateProfile':
      return { ...state, profile: { ...state.profile, ...action.payload } }
    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

