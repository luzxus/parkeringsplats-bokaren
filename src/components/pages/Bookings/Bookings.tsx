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
import { app, fireDb } from '../../..'
import './Bookings.css'
import { getAuth } from 'firebase/auth'
function Bookings() {
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([])

  useEffect(() => {
    const getParkingSpots = async (): Promise<void> => {
      const querySnapshot = await getDocs(collection(fireDb, 'ParkingSpots'))

      const promises = querySnapshot.docs.map(async (doc) => {
        if (doc.exists()) {
          const data = doc.data()
          const parkingSpotIdRef = doc.id
          const pData: ParkingSpot = {
            id: parkingSpotIdRef,
            location: data.location,
            name: data.name,
          }
          return pData
        }
      })
      const parkingsArray = await Promise.all(promises)
      const filteredParkingSpots: ParkingSpot[] = parkingsArray.filter(
        (pSpot) => pSpot !== undefined,
      ) as ParkingSpot[]
      setParkingSpots(filteredParkingSpots)
    }
    getParkingSpots()
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(fireDb, 'Bookings'),
      async (snapshot) => {
        const promises = snapshot.docs.map(async (doc) => {
          const data = doc.data() as DocumentData
          const startDate = data.start_date.toDate()
          const endDate = data.end_date.toDate()
          const createdDate = data.createdDate
          const parking_spotRef = data.parking_spot_id as DocumentReference<
            ParkingSpot
          >
          const userRef = data.user_id as DocumentReference<User>
          const booking_id = doc.id

          const user_doc: DocumentSnapshot<User> = await getDoc(userRef)
          const parking_doc: DocumentSnapshot<ParkingSpot> = await getDoc(
            parking_spotRef,
          )

          if (user_doc.exists() && parking_doc.exists()) {
            const bookingData: BookingData = {
              user_id: user_doc.data(),
              booking_id: booking_id,
              parking_spot: parking_doc.data(),
              start_date: startDate,
              end_date: endDate,
              createdDate: createdDate,
            }
            return bookingData
          } else {
            console.log('document does not exist')
            return null
          }
        })

        const bookingArray = await Promise.all(promises)

        /* 
      We also use the filter method to remove any null values from the bookingArray. 
      This is necessary because if a document does not exist, we return null from the map function.
      */
        const filteredBookingArray: BookingData[] = bookingArray.filter(
          (booking) => booking !== null,
        ) as BookingData[]
        setBookings(filteredBookingArray)
      },
    )

    return () => unsubscribe()
  }, [])
  const auth = getAuth(app)
  return (
    <div className="booking-screen">
      <h1 style={{ textAlign: 'center' }}>Boka här</h1>
      <BookingsForm
        userId={auth.currentUser?.uid}
        parkingSpots={parkingSpots}
      />
      <h2>Bookings</h2>
      <BookingsTable bookings={bookings} />
    </div>
  )
}

export default Bookings
