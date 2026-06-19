import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Booking() {
  const location = useLocation()
  const navigate = useNavigate()
  const booking = location.state
  const [equipmentBooking, setEquipmentBooking] = useState(false)

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
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="equipment" style={{ fontWeight: '600', cursor: 'pointer' }}>
            Book equipment ($20):
          </label>
          <input
            type="checkbox"
            id="equipment"
            checked={equipmentBooking}
            onChange={(e) => setEquipmentBooking(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => console.log('Booking confirmed')}
            style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
            aria-label="Confirm booking"
          >
            Confirm Booking
          </button>
          <button
            onClick={() => navigate('/court-booking')}
            style={{ padding: '10px 20px', backgroundColor: '#304153', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
            aria-label="Return"
            >
              Return
          </button>
        </div>
      </div>
    </div>
  )
}
