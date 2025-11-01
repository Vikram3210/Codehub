// src/hooks/useApp.js
import { useContext } from 'react'
import { AppContext } from '../state/AppContext'

export function useApp() {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error('useApp must be used within AppProvider')
    return ctx
}