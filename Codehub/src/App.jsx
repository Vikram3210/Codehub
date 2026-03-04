import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import LanguageSelect from './pages/LanguageSelect.jsx'
import Levels from './pages/Levels.jsx'
import { AppProvider } from './state/AppContext.jsx'

function App() {
  return (
    <AppProvider>
      <div className="min-vh-100 gradient-bg">
        <Routes>
          <Route path="/" element={<Navigate to="/languages" replace />} />
          <Route path="/languages" element={<LanguageSelect />} />
          <Route path="/levels/:lang" element={<Levels />} />
          <Route path="*" element={<Navigate to="/languages" replace />} />
        </Routes>
      </div>
    </AppProvider>
  )
}

export default App
