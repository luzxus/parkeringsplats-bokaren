import React, { useState } from 'react'
import LandingPage from './components/pages/LandingPage'
import './globalStyles.css'
import { Header } from './components/Header/Header'
import { getAuth, signOut } from 'firebase/auth'
import { app } from './index'
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'
import Signup from './components/pages/Signup/Signup'
const App: React.FC = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const auth = getAuth(app)
  const handleLogin = (email: string, password: string) => {
    // Use Firebase or another authentication library to handle login
    setIsLoggedIn(true)
  }
  const logoutHandler = () => {
    // Use Firebase or another authentication library to handle login

    signOut(auth)
      .then(() => {
        setIsLoggedIn(false)
        navigate('/')
      })
      .catch((error: any) => {
        console.error('Failed to sign out:', error)
      })
  }
  const signupHandler = () => {
    setIsLoggedIn(true)
    navigate('/')
  }

  return (
    <>
      <Header handleLogout={logoutHandler} isLoggedIn={isLoggedIn} />
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage isLoggedIn={isLoggedIn} onLogin={handleLogin} />
          }
        />
        <Route path="/signup" element={<Signup onSignup={signupHandler} />} />
      </Routes>
    </>
  )
}

export default App
