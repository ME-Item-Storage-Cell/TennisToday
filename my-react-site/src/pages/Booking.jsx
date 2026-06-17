import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Booking() {
  const location = useLocation()
  const navigate = useNavigate()
  const booking = location.state

  useEffect(() => {
    if (!booking || !booking.court || !booking.date || !booking.startTime) {
      navigate('/court-booking', { replace: true })
    }
  }, [booking, navigate])

  if (!booking || !booking.court || !booking.date || !booking.startTime) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Booking</h1>
        <p>Missing booking details. Redirecting to court booking...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Booking</h1>
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '500px' }}>
        <p style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 'bold' }}>Your selected booking:</p>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: '600' }}>Court:</span> Court {booking.court}
        </div>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: '600' }}>Date:</span> {booking.date}
        </div>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: '600' }}>Time:</span> {booking.timeRange || `${booking.startTime} - ${booking.endTime}`}
        </div>
      </div>
    </div>
  )
}
