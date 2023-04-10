import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface LandingPageProps {
  isLoggedIn: boolean
}

const LandingPage: React.FC<LandingPageProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate()

  const navigateHandler = () => {
    navigate(isLoggedIn ? '/bookings' : '/login')
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Välkommen till Halmstads parkeringsbokare!</h1>
      <p style={{ fontWeight: 'bold' }}>
        Välj bland våra tre parkeringsplatser och boka
      </p>

      <Button variant="contained" onClick={navigateHandler}>
        {isLoggedIn ? 'Book Now' : 'Login'}
      </Button>
    </div>
  )
}

export default LandingPage
