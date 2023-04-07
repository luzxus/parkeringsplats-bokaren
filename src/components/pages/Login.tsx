import React, { useState } from 'react'
import './Login.css'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

interface LoginProps {
  onLogin: (email: string, password: string) => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const auth = getAuth()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user

        localStorage.setItem(
          'user',
          JSON.stringify({ email: user.email, id: user.uid }),
        )

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
