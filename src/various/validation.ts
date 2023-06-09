import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore'
import { BookingData, ParkingSpot, User } from '../models'
import { fireDb } from '..'

export function getOverlappingBookings(
  bookings: BookingData[],
  startDate: Date,
  endDate: Date,
  includedParkingSpot?: string,
): BookingData[] {
  const overlappingBookings = bookings.filter((booking) => {
    const parkingCollection = collection(fireDb, 'ParkingSpots')
    const parkingDoc = doc(parkingCollection, includedParkingSpot)
    if (parkingDoc && booking.parking_spot_id.id !== parkingDoc.id) {
      return false
    }

    const timestamp_start = (booking.start_date as unknown) as Timestamp
    const bookingStartDate = timestamp_start.toDate()
    const timestamp_end = (booking.end_date as unknown) as Timestamp
    const bookingEndDate = timestamp_end.toDate()

    return (
      (bookingStartDate <= startDate && bookingEndDate >= startDate) ||
      (bookingStartDate <= endDate && bookingEndDate >= endDate) ||
      (bookingStartDate >= startDate && bookingEndDate <= endDate)
    )
  })

  return overlappingBookings
}

export function getUserBookings(
  bookings: BookingData[],
  userId: string,
): BookingData[] {
  const userBookings = bookings.filter(
    (booking: BookingData) => booking.user_id.id === userId,
  )
  //fixa any conversionen
  return userBookings
}
export async function getAllDocumentsFromCollection(collectionName: string) {
  const collectionRef = collection(fireDb, collectionName)
  const snapshot = await getDocs(collectionRef)
  const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  return (documents as unknown) as BookingData[]
}

export const getDocumentById = async (
  documentId: string,
  collectionName: string,
) => {
  const documentRef = doc(fireDb, collectionName, documentId)
  const document = await getDoc(documentRef)

  if (document.exists()) {
    return document.data()
  } else {
    console.log('Document does not exist')
    return null
  }
}

export const getUserBookingsInAWeek = (userBookings: BookingData[]) => {
  const today = new Date()
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const bookingsInLastWeek = userBookings.filter((booking) => {
    const timestamp = (booking.start_date as unknown) as Timestamp
    const bookingStartDate = timestamp.toDate()
    return bookingStartDate >= oneWeekAgo
  })
  return bookingsInLastWeek
}
