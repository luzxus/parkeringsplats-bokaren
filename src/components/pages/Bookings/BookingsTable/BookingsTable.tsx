import React, { useMemo, useState } from 'react'
import { BookingData } from '../../../../models'
import './BookingsTable.css'
import { Box, Tabs, Tab } from '@mui/material'

interface BookingsTableProps {
  bookings: BookingData[]
}

interface TabPanelProps {
  value: number
  index: number
  data: BookingData[]
}

function TabPanel({ value, index, data }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
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
          {data.map((bookingObj: BookingData) => (
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
    </div>
  )
}

function BookingsTable({ bookings }: BookingsTableProps) {
  const [value, setValue] = useState(0)

  const filteredBookings = useMemo(() => {
    const currentDate = new Date()
    return bookings.filter((booking) => {
      const endDate = new Date(booking.end_date)
      return endDate < currentDate
    })
  }, [bookings])

  const currentBookings = useMemo(() => {
    const currentDate = new Date()
    return bookings.filter((booking) => {
      const endDate = new Date(booking.end_date)
      return endDate >= currentDate
    })
  }, [bookings])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Current Bookings" />
          <Tab label="Old Bookings" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0} data={currentBookings} />
      <TabPanel value={value} index={1} data={filteredBookings} />
    </>
  )
}

export default React.memo(BookingsTable)
