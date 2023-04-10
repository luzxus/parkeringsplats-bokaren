import React, { useState, useCallback, useRef } from 'react'

import { BookingData, BookingPostData, ParkingSpot } from '../../../../models'
import DateRangePicker from '../../../Datepicker/DateRangePicker'
import { Timestamp, addDoc, collection, doc } from '@firebase/firestore'
import { fireDb } from '../../../..'
import { getCurrentDate } from '../../../../various/utils'
import {
  getAllDocumentsFromCollection,
  getOverlappingBookings,
  getUserBookings,
} from '../../../../various/validation'
import { getAuth } from '@firebase/auth'
import './BookingsForm.css'
import InfoIcon from '@mui/icons-material/Info'
import InfoPopup from '../../../Popup/InfoPopup'
type Props = {
  userId: string
  parkingSpots: ParkingSpot[]
}

const BookingForm: React.FC<Props> = ({ parkingSpots, userId }) => {
  const [parkingSpotId, setParkingSpotId] = useState<string>('')
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  const handleParkingSpotChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setParkingSpotId(event.target.value)
      setFormErrors({})
    },
    [],
  )
  const handleDateRangeChange = useCallback((start: Date, end: Date) => {
    setStartDate(start)
    setEndDate(end)
    setFormErrors({})
  }, [])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      // Add 'async' here
      event.preventDefault()

      if (!parkingSpotId) {
        setFormErrors((errors) => ({
          ...errors,
          parkingSpot: 'Please select a parking spot.',
        }))

        return
      }

      if (!startDate || !endDate) {
        setFormErrors((errors) => ({
          ...errors,
          dateRange: 'Please select a date range.',
        }))

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
        parkingSpotId,
      )
      if (overlappingBookings.length > 0) {
        setFormErrors((errors) => ({
          ...errors,
          parkingSpot:
            'The selected parking spot is not available for the selected date range.',
        }))
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
        setFormErrors((errors) => ({
          ...errors,
          dateRange:
            'You have already booked a parking spot for the selected date.',
        }))
        return
      }

      //Create booking
      const parkingSpotRef = doc(fireDb, `ParkingSpots/${parkingSpotId}`)
      const userRef = doc(fireDb, `Users/${userId}`)

      const currentDate = getCurrentDate()
      const newBookingData: BookingPostData = {
        end_date: endDate,
        parking_spot_id: parkingSpotRef,
        start_date: startDate,
        user_id: userRef,
        createdDate: currentDate,
      }
      formErrors && setFormErrors({}) //reset form error

      await addBookingPost(newBookingData)
    },
    [parkingSpotId, startDate, endDate, userId, formErrors],
  )

  async function addBookingPost(bookingData: BookingPostData) {
    await addDoc(collection(fireDb, 'Bookings'), bookingData)
  }

  const [infoPopupOpen, setInfoPopupOpen] = useState(false)

  const openInfoPopup = () => {
    setInfoPopupOpen(true)
  }

  const closeInfoPopup = () => {
    setInfoPopupOpen(false)
  }

  return (
    <div className="form-container">
      {infoPopupOpen && <InfoPopup onClose={closeInfoPopup} />}

      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="parking-spot-select">Parking Spot:</label>
          <div className="icon-content-wrapper">
            <select
              id="parking-spot-select"
              name="parking-spot"
              value={parkingSpotId}
              onChange={handleParkingSpotChange}
              required
            >
              <option value="">Välj parkeringsplats</option>
              {parkingSpots.map((spot) => (
                <option key={spot.id} value={spot.id}>
                  {spot.name}
                </option>
              ))}
            </select>
            <InfoIcon cursor="pointer" color="info" onClick={openInfoPopup} />
          </div>
        </div>
        {formErrors.parkingSpot && (
          <p style={{ color: 'red', fontSize: '12px' }}>
            {formErrors.parkingSpot}
          </p>
        )}
        <div className="input-container">
          <label htmlFor="date-range-picker">Date Range:</label>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onRangeChange={handleDateRangeChange}
          />
        </div>
        {formErrors.dateRange && (
          <p style={{ color: 'red', fontSize: '12px' }}>
            {formErrors.dateRange}
          </p>
        )}
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}
export default BookingForm
