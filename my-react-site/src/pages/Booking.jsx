import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Booking() {
  const location = useLocation()
  const navigate = useNavigate()
  const booking = location.state
  const [equipmentBooking, setEquipmentBooking] = useState(false)
  const [error, setError] = useState('')
  const [session, setSession] = useState(null)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!booking || !booking.court || !booking.date || !booking.startTime) {
      navigate('/court-booking', { replace: true })
    }
  }, [booking, navigate])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  if (!booking || !booking.court || !booking.date || !booking.startTime) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Booking</h1>
        <p>Missing booking details. Redirecting to court booking...</p>
      </div>
    )
  }

  const getTimeStamp = (date, time) => {
    return new Date(`${date}T${time}`).toISOString();
  }

  async function createBooking(courtNum, bookingTime, userID, bookingCode, boolEquipment) {
    setError('');
    const { data, error } = await supabase
      .from("Venue1_Bookings")
      .insert([
        {
          CourtNum: courtNum,
          BookingTime: bookingTime,
          Booker: userID,
          BookingCode: bookingCode,
          bookedEquipment: boolEquipment
        }
      ]);

    if (error) {
      if (error.code === '23505') {
        setError('This court is already booked for that time');
      } else {
        setError(error.message);
      }
      return false;
    } else {
      setSuccess('Booking successful, check your email for your code.')
      setTimeout(() => {
        navigate('/court-booking', { replace: true });
      }, 2000);
      return true;
    }
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
        {error && (
          <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', fontSize: '14px' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{marginTop: '12px', padding:'12px', backgroundColor: '#90EE90', color: '	#013220', borderRadius: '4px', fontSize: '14px'}}>
            {success}
          </div>
        )}
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button
            onClick={async () => {
              if (!session) {
                setError('Please log in first');
                setTimeout(() => {
                  navigate('/login');
                }, 500);
                return;
              }
              const bookingCode = Math.random().toString(36).substring(2, 11);
              const bookingTime = getTimeStamp(booking.date, booking.startTime);
              await createBooking(booking.court, bookingTime, session.user.id, bookingCode, equipmentBooking);
            }}
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
