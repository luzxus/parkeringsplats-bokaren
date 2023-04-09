import React, { useMemo, useState } from 'react'
import { BookingData } from '../../../../models'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Button,
} from '@mui/material'
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore'
import { app, fireDb } from '../../../..'
import { getAuth } from 'firebase/auth'

interface BookingsTableProps {
  bookings: BookingData[]
}

interface TabPanelProps {
  value: number
  index: number
  data: BookingData[]
  deleteBooking?: (id: string) => void
}

function TabPanel({ value, index, data, deleteBooking }: TabPanelProps) {
  const auth = getAuth()
  const currentUserEmail = auth.currentUser?.email ?? ''
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Created</TableCell>
              <TableCell>User</TableCell>
              <TableCell>From Date</TableCell>
              <TableCell>To Date</TableCell>
              <TableCell>Parking Spot ID</TableCell>
              {deleteBooking && <TableCell>Manage</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((bookingObj: BookingData) => (
              <TableRow key={bookingObj.booking_id}>
                <TableCell>{bookingObj.createdDate}</TableCell>
                <TableCell>{bookingObj.user_id.name}</TableCell>
                <TableCell>{bookingObj.start_date.toDateString()}</TableCell>
                <TableCell>{bookingObj.end_date.toDateString()}</TableCell>
                <TableCell>{bookingObj.parking_spot_id.name}</TableCell>
                {deleteBooking && (
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => deleteBooking(bookingObj.booking_id)}
                      disabled={bookingObj.user_id.email !== currentUserEmail}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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

  async function deleteBooking(bookingId: string) {
    const docRef: DocumentReference<DocumentData> = doc(
      fireDb,
      'Bookings',
      bookingId,
    )
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef)

    // Check if the booking document exists
    if (!docSnap.exists()) {
      console.log('Booking document does not exist')
      return
    }
    /* 
    const bookingData: BookingData = docSnap.data() as BookingData
    // Check if the current user is the creator of the booking document
      const auth = getAuth(app)
    if (bookingData.user.id !== auth.currentUser?.uid) {
      console.log('You do not have permission to delete this booking')
      return
    } */

    // Delete the booking document
    await deleteDoc(docRef)

    console.log('Booking document deleted successfully')
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
          <Tab label="Expired Bookings" />
        </Tabs>
      </Box>
      <TabPanel
        deleteBooking={deleteBooking}
        value={value}
        index={0}
        data={currentBookings}
      />
      <TabPanel value={value} index={1} data={filteredBookings} />
    </>
  )
}

export default React.memo(BookingsTable)
