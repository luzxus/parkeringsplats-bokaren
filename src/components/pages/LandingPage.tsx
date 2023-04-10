import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import BookingsTable from './Bookings/BookingsTable/BookingsTable'
import { useBookingsData } from '../../various/bookings'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'

interface LandingPageProps {
  isLoggedIn: boolean
}

const LandingPage: React.FC<LandingPageProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate()

  const navigateHandler = () => {
    navigate(isLoggedIn ? '/bookings' : '/login')
  }

  const { bookings, parkingSpots } = useBookingsData()

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Välkommen till Halmstads parkeringsbokare!</h1>
      <p style={{ fontWeight: 'bold' }}>
        Välj bland våra tre parkeringsplatser och boka
      </p>

      <Button variant="contained" onClick={navigateHandler}>
        {isLoggedIn ? 'Boka nu' : 'Login'}
      </Button>

      {isLoggedIn && (
        <Grid2 mt={4}>
          <BookingsTable bookings={bookings} />
        </Grid2>
      )}
    </div>
  )
}

export default LandingPage
