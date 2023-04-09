import { DocumentData, DocumentReference } from 'firebase/firestore'

export interface BookingData {
  booking_id: string
  end_date: Date
  parking_spot_id: DocumentData
  start_date: Date
  user_id: DocumentData
  createdDate: string
}

export interface BookingPostData {
  end_date: Date
  parking_spot_id: DocumentReference<DocumentData>
  start_date: Date
  user_id: DocumentReference<DocumentData>
  createdDate: string
}

export interface User {
  //kommer bara hämta users
  id: string
  name: string
  email: string
  password: string
}

export interface ParkingSpot {
  id: string
  location: string
  name: string
}
