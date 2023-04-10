import React, { useEffect, useRef, useState } from 'react'
import DateRangePicker from '../../../Datepicker/DateRangePicker'
import { BookingData, BookingPostData, ParkingSpot } from '../../../../models'
import { Timestamp, addDoc, collection, doc } from 'firebase/firestore'
import { fireDb } from '../../../..'
import { getCurrentDate } from '../../../../various/utils'
import './BookingsForm.css'
import {
  getAllDocumentsFromCollection,
  getOverlappingBookings,
  getUserBookings,
  getUserBookingsInAWeek,
} from '../../../../various/validation'
import { timeStamp } from 'console'
interface Props {
  parkingSpots: ParkingSpot[]
  userId: string | undefined
}

export const BookingsForm = ({ parkingSpots, userId }: Props) => {
  const [parkingSpot, setParkingSpot] = useState('')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [formError, setFormError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!parkingSpot) {
      setFormError('Please select a parking spot.')
      return
    }

    if (!startDate || !endDate) {
      setFormError('Please select a date range.')
      return
    }
    const bookings: BookingData[] = await getAllDocumentsFromCollection(
      'Bookings',
    )
    // Check if the selected parking spot is available for the selected date range
    const overlappingBookings = getOverlappingBookings(
      bookings,
      startDate,
      endDate,
      parkingSpot,
    )
    if (overlappingBookings.length > 0) {
      setFormError(
        'The selected parking spot is not available for the selected date range.',
      )
      return
    }

    // Check if the user has already booked a spot for the same day
    const userBookings = getUserBookings(bookings, userId!)
    const bookingsOnSameDay = userBookings.filter((booking: BookingData) => {
      const timestamp = (booking.start_date as unknown) as Timestamp
      const bookingStartDate = timestamp.toDate()

      return bookingStartDate.toString() === startDate.toString()
    })
    if (bookingsOnSameDay.length > 0) {
      setFormError(
        'You have already booked a parking spot for the selected date.',
      )
      return
    }

    // Check if the user has reached their maximum number of bookings for the week
    //Not necessary atm
    /*   const bookingsInLastWeek = getUserBookingsInAWeek(userBookings)
    if (bookingsInLastWeek.length >= 2) {
      setFormError(
        'You have reached your maximum number of bookings for the week.',
      )
      return
    } */

    //Create booking
    const parkingSpotRef = doc(fireDb, `ParkingSpots/${parkingSpot}`)
    const userRef = doc(fireDb, `Users/${userId}`)
    const currentDate = getCurrentDate()

    const newBookingData: BookingPostData = {
      end_date: endDate,
      parking_spot_id: parkingSpotRef,
      start_date: startDate,
      user_id: userRef,
      createdDate: currentDate,
    }
    formError && setFormError('') //reset form error

    await addBookingPost(newBookingData)
  }

  async function addBookingPost(bookingData: BookingPostData) {
    await addDoc(collection(fireDb, 'Bookings'), bookingData)
  }

  const errorRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (formError) errorRef.current && errorRef.current.scrollIntoView()
  }, [formError])

  return (
    <form onSubmit={handleSubmit}>
      {formError && (
        <p ref={errorRef} style={{ color: 'red' }}>
          {formError}
        </p>
      )}
      <label>
        Select Parking Spot:
        <select
          value={parkingSpot}
          onChange={(e) => setParkingSpot(e.target.value)}
          required
        >
          <option value="">-- Select a Parking Spot --</option>
          {parkingSpots.map((spot) => (
            <option value={spot.id} key={spot.name}>
              {spot.name}
            </option>
          ))}
        </select>
      </label>
      <br />
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onRangeChange={(start, end) => {
          setStartDate(start)
          setEndDate(end)
        }}
      />
      <br />
      <div>
        <p>
          Sunt förnuft vid bokningen av parkeringsplatserna tills all validering
          och funktionalitet är på plats! ;)
        </p>
        <p>
          San fransisco är parkeringsplatsen som är nedanför kontoret på
          parkeringsplats 14
        </p>
        <p>
          Boston parkeringarna är i garaget.
          <span style={{ backgroundColor: 'yellow' }}>
            <br />
            Notera att boston-parkeringarna kräver att man parkerar framför
            varandra så den som är innerst (Boston 2) behöver vänta på att
            Boston 1 är ute
          </span>{' '}
        </p>
      </div>
      <br />

      <button type="submit">Book Now</button>
    </form>
  )
}

export default BookingsForm
