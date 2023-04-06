import React from 'react'
import Bookings from './Bookings/Bookings'
import Login from './Login'

interface LandingPageProps {
  onLogin: (email: string, password: string) => void
  isLoggedIn: boolean
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, isLoggedIn }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Forefront Halmstads parkeringsplats bokare!</h1>
      <p style={{ fontWeight: 'bold' }}>
        Välj bland våra två parkeringsplatser och boka
      </p>
      {!isLoggedIn ? <Login onLogin={onLogin} /> : <Bookings />}
    </div>
  )
}

export default LandingPage
