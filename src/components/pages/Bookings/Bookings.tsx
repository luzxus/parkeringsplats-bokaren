import React, { useState, useEffect, useMemo } from 'react'
import './Bookings.css'
import { BookingData, ParkingSpot, User } from '../../../models'
import BookingsTable from './BookingsTable/BookingsTable'
import BookingsForm from './BookingsForm/BookingsForm'
import {
  collection,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore'
import './Bookings.css'
import { getAuth } from 'firebase/auth'
import { fireDb } from '../../..'
import { Grid, Typography } from '@mui/material'

type BookingProps = {
  parkingSpots: ParkingSpot[]
  bookings: BookingData[]
}

const Bookings: React.FC<BookingProps> = ({ bookings, parkingSpots }) => {
  const auth = getAuth()
  return (
    <div className="booking-screen">
      <Grid item xs={12} m={2}>
        <Typography
          variant="h3"
          textAlign="center"
          component="div"
          gutterBottom
        >
          Boka här
        </Typography>
      </Grid>
      <BookingsForm
        userId={auth.currentUser?.uid!}
        parkingSpots={parkingSpots}
      />
      <BookingsTable bookings={bookings} />
    </div>
  )
}

export default Bookings
