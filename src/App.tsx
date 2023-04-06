import React, { useState } from 'react'
import LandingPage from './components/pages/LandingPage'
import './globalStyles.css'
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (email: string, password: string) => {
    // Use Firebase or another authentication library to handle login
    setIsLoggedIn(true)
  }

  return <LandingPage isLoggedIn={isLoggedIn} onLogin={handleLogin} />
}

export default App
