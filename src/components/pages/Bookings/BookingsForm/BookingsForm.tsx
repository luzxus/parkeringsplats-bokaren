import React, { useState } from 'react'
import DateRangePicker from '../../../Datepicker/DateRangePicker'
import { BookingPostData, ParkingSpot } from '../../../../models'
import { addDoc, collection, doc } from 'firebase/firestore'
import { fireDb } from '../../../..'
import { getCurrentDate } from '../../../../various/utils'
import './BookingsForm.css'
interface Props {
  parkingSpots: ParkingSpot[]
  userId: string
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

    await addBookingPost(newBookingData)
  }

  async function addBookingPost(bookingData: BookingPostData) {
    await addDoc(collection(fireDb, 'Bookings'), bookingData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {formError && <p style={{ color: 'red' }}>{formError}</p>}
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
        <p>San fransisco = 14 </p>
        <p>Boston = Underground</p>
      </div>
      <br />

      <button type="submit">Book Now</button>
    </form>
  )
}

export default BookingsForm
