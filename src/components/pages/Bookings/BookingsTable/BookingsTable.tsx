import React from 'react'
import { BookingData } from '../../../../models'
import './BookingsTable.css'
interface BookingsTableProps {
  bookings: BookingData[]
}

function BookingsTable({ bookings }: BookingsTableProps) {
  return (
    <table className="bookings-table">
      <thead>
        <tr>
          <th>Created</th>
          <th>User</th>
          <th>From Date</th>
          <th>To Date</th>

          <th>Parking Spot ID</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((bookingObj: BookingData) => (
          <tr key={bookingObj.booking_id}>
            <td>{bookingObj.createdDate}</td>

            <td>{bookingObj.user.name}</td>

            <td>{bookingObj.start_date.toDateString()}</td>
            <td>{bookingObj.end_date.toDateString()}</td>
            <td>{bookingObj.parking_spot.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default React.memo(BookingsTable)
