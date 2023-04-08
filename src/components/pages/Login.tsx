import React, { useState, useEffect } from 'react'
import './Login.css'
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth'
import { User } from '../../models'

interface LoginProps {
  onLogin: (email: string, password: string) => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const auth = getAuth()

  useEffect(() => {
    // Check if a user is already logged in
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user) {
        onLogin(user.email, password)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [auth, onLogin, password])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user

            onLogin(email, password)
          })
          .catch((error: any) => {
            // Handle authentication errors
            const errorCode = error.code
            const errorMessage = error.message
            console.error(
              `Failed to authenticate user: ${errorCode} - ${errorMessage}`,
            )

            setError('Invalid email or password')
          })
      })
      .catch((error: any) => {
        console.error('Failed to set persistence:', error)
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="login-wrapper">
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button type="submit">Login</button>
        {error && <div className="error">{error}</div>}
      </div>
    </form>
  )
}

export default Login
