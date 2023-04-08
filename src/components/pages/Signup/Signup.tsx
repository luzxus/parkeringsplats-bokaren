import React, { useState } from 'react'
import './Signup.css'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getAuth } from 'firebase/auth'
import { app, fireDb } from '../../..'
import { collection, doc, setDoc } from 'firebase/firestore'

interface SignupProps {
  onSignup: () => void
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const auth = getAuth(app)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name || !email || !password) {
      setError('Name, email, and password are required')
      return
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        // Update the user's display name with the provided name
        return updateProfile(user, { displayName: name })
      })
      .then(() => {
        // Display name updated
        const user = auth.currentUser

        if (user && user.uid) {
          const usersColl = collection(fireDb, 'Users')

          const userDoc = doc(usersColl, user?.uid)

          const userData = {
            name: user.displayName,
            email: user.email,
            password: password,
          }
          onSignup()

          return setDoc(userDoc, userData)
        } else {
          console.log('No user or user id found for ', user)
        }
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        // ..
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="signup-wrapper">
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
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
        <button type="submit">Sign Up</button>
        {error && <div className="error">{error}</div>}
      </div>
    </form>
  )
}

export default Signup
