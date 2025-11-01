// src/main.jsx (COMPLETE CORRECTED CODE)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// FIX: Changed the import extension from .jsx to .js to resolve the file system error.
import { AuthProvider } from './state/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* CRITICAL: AuthProvider wraps the whole app here. */}
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)