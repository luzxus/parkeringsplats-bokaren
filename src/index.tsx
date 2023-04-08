import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'
import { BrowserRouter } from 'react-router-dom'

const firebaseConfig = {
  apiKey: 'AIzaSyDhB_mDwqpB1PY4fOYhCNOWLnBcXWXtDss',
  authDomain: 'booking-app-a5ff5.firebaseapp.com',
  projectId: 'booking-app-a5ff5',
  storageBucket: 'booking-app-a5ff5.appspot.com',
  messagingSenderId: '727279984251',
  appId: '1:727279984251:web:dc446cfcb1acd77a220cde',
  measurementId: 'G-K2GCQ9TCPF',
  databaseURL:
    'https://booking-app-a5ff5-default-rtdb.europe-west1.firebasedatabase.app',
}
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
export const fireDb = getFirestore(app)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

reportWebVitals()
/* databaseURL:
'https://booking-app-a5ff5-default-rtdb.europe-west1.firebasedatabase.app', */
