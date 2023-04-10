import React, { useState, useEffect, lazy, Suspense } from 'react'
import LandingPage from './components/pages/LandingPage'
import './globalStyles.css'
import { Header } from './components/Header/Header'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { Firestore } from '@firebase/firestore'
import { useBookingsData } from './various/bookings'

const Signup = lazy(() => import('./components/pages/Signup/Signup'))
const Login = lazy(() => import('./components/pages/Login'))
const Bookings = lazy(() => import('./components/pages/Bookings/Bookings'))

const App = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const auth = getAuth()

  // Listen for Firebase authentication changes and update state
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    })
  }, [auth])

  const loginHandler = () => {
    // Use Firebase or another authentication library to handle login
    navigate('/bookings')
  }

  const logoutHandler = () => {
    // Use Firebase or another authentication library to handle logout
    signOut(auth)
      .then(() => {
        setIsLoggedIn(false)
        navigate('/')
      })
      .catch((error) => {
        console.error('Failed to sign out:', error)
      })
  }

  const signupHandler = () => {
    navigate('/')
  }

  const { bookings, parkingSpots } = useBookingsData()

  return (
    <>
      <Header handleLogout={logoutHandler} isLoggedIn={isLoggedIn} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} />} />
          <Route path="/signup" element={<Signup onSignup={signupHandler} />} />
          <Route path="/login" element={<Login onLogin={loginHandler} />} />
          <Route
            path="/bookings"
            element={
              <Bookings bookings={bookings} parkingSpots={parkingSpots} />
            }
          />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
