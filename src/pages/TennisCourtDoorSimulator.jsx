import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function TennisCourtDoorSimulator() {
    const [courtChoice, setCourtChoice] = useState(1)
    const [bookingCode, setBookingCode] = useState('')
    const [message, setMessage] = useState('')
    const [doorOpen, setDoorOpen] = useState('Closed')
    const [error, setError] = useState('')
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log("Court choice:" + courtChoice)
    }, [courtChoice])

    useEffect(() => {
    async function loadSession() {
      console.log('[MyBookings] Loading session...')
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('[MyBookings] Session load error:', error)
        setError(error.message)
      } else {
        console.log('[MyBookings] Session loaded:', data.session)
        setSession(data.session)
      }
      setLoading(false)
    }

    loadSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_, currentSession) => {
      console.log('[MyBookings] Auth state changed:', currentSession)
      setSession(currentSession)
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
    }, [])

    const getBookingPeriod = () => {
        const now = new Date()
        const minutes = now.getMinutes()
        now.setMinutes(minutes - (minutes % 30))
        now.setSeconds(0)
        now.setMilliseconds(0)
        console.log(now)
        return now.toISOString()
    }

    async function attemptEntry(bookingCode) {
        setError('')
        const { data, error } = await supabase
            .from('Venue1_Bookings')
            .select('*')
            .eq('Booker', session.user.id)
            .eq('BookingTime', getBookingPeriod())
            .eq('BookingCode', bookingCode)

        if (error) {
            setError(error.message)
            return
        }

        if (data) {
            setDoorOpen('Open')
            setTimeout(() => {
                  setDoorOpen('Closed');
                }, 10000);
        }
    }

    return (
        <div style={{ padding: '20px', alignItems: 'center' }}>
            <h1>Tennis Court</h1>
            <div> 
                <button
                    onClick={() => {
                        setCourtChoice(1)
                    }}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
                    aria-label="Select Court 1"
                >
                    Court 1
                </button>
                <button
                    onClick={() => {
                        setCourtChoice(2)
                    }}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
                    aria-label="Select Court 1"
                >
                    Court 2
                </button>
                <button
                    onClick={() => {
                        setCourtChoice(3)
                    }}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
                    aria-label="Select Court 1"
                >
                    Court 3
                </button>
                <button
                    onClick={() => {
                        setCourtChoice(4)
                    }}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
                    aria-label="Select Court 1"
                >
                    Court 4
                </button>
                <button
                    onClick={() => {
                        setCourtChoice(5)
                    }}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
                    aria-label="Select Court 1"
                >
                    Court 5
                </button>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Enter booking code"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value)}
                />
                <button
                    onClick={() => {
                        attemptEntry(bookingCode)
                    }}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
                    aria-label="Select Court 1"
                >
                    Enter
                </button>
            </div>
        </div>
    )
}