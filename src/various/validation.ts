import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
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
  excludedBookingId?: string,
): BookingData[] {
  const overlappingBookings = bookings.filter((booking) => {
    if (excludedBookingId && booking.booking_id === excludedBookingId) {
      return false
    }

    const bookingStart = new Date(booking.start_date)
    const bookingEnd = new Date(booking.end_date)

    return (
      (bookingStart <= startDate && bookingEnd >= startDate) ||
      (bookingStart <= endDate && bookingEnd >= endDate) ||
      (bookingStart >= startDate && bookingEnd <= endDate)
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
