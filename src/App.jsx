import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/login'
import Account from './pages/Account'
import CourtBooking from './pages/CourtBooking'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'
import TennisCourtDoorSimulator from './pages/TennisCourtDoorSimulator'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/court-booking" element={<CourtBooking />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/tennis-court-door-simulation" element={<TennisCourtDoorSimulator />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App