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
    }, [courtChoice])

    useEffect(() => {
    async function loadSession() {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        setError(error.message)
      } else {
        setSession(data.session)
      }
      setLoading(false)
    }

    loadSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_, currentSession) => {
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
        console.log(now.toISOString())
        return now.toISOString()
    }

    async function attemptEntry(bookingCode) {
        setError('')
        const { data, error } = await supabase
            .from('Venue1_Bookings')
            .select('*')
            .eq('CourtNum', courtChoice)
            .eq('BookingTime', getBookingPeriod())
            .eq('BookingCode', bookingCode)

        console.log(data)
        console.log(bookingCode)
        if (error) {
            setError(error.message)
            return
        }

        if (data.length > 0) {
            setDoorOpen('Open')

        } else {
            setDoorOpen('Closed')
        }
    }

    return (
        <div className='loginContainer'>
            <div className='pinpadBox'>
            <h1 className='pageHeading'>Tennis Court Pinpad</h1>
            <p style={{margin: '0'}}>Select a court:</p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '5px 0px', overflowX: 'auto', overflowY: 'hidden' }}>
                
                <button
                    onClick={() => {
                        setCourtChoice(1)
                        console.log(courtChoice)
                    }}
                    style={{ padding: '6px 12px', backgroundColor: courtChoice === 1 ? '#007bff' : '#e0e0e0', color: courtChoice === 1 ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', transition: 'background-color 0.2s, color 0.2s' }}
                    aria-label="Select Court 1"
                >
                    Court 1
                </button>
                <button
                    onClick={() => {
                        setCourtChoice(2)
                    }}
                    style={{ padding: '6px 12px', backgroundColor: courtChoice === 2 ? '#007bff' : '#e0e0e0', color: courtChoice === 2 ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', transition: 'background-color 0.2s, color 0.2s' }}
                    aria-label="Select Court 2"
                >
                    Court 2
                </button>
                <button
                    onClick={() => {
                        setCourtChoice(3)
                    }}
                    style={{ padding: '6px 12px', backgroundColor: courtChoice === 3 ? '#007bff' : '#e0e0e0', color: courtChoice === 3 ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', transition: 'background-color 0.2s, color 0.2s' }}
                    aria-label="Select Court 3"
                >
                    Court 3
                </button>
                <button
                    onClick={() => {
                        setCourtChoice(4)
                    }}
                    style={{ padding: '6px 12px', backgroundColor: courtChoice === 4 ? '#007bff' : '#e0e0e0', color: courtChoice === 4 ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', transition: 'background-color 0.2s, color 0.2s' }}
                    aria-label="Select Court 4"
                >
                    Court 4
                </button>
                <button
                    onClick={() => {
                        setCourtChoice(5)
                    }}
                    style={{ padding: '6px 12px', backgroundColor: courtChoice === 5 ? '#007bff' : '#e0e0e0', color: courtChoice === 5 ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', transition: 'background-color 0.2s, color 0.2s' }}
                    aria-label="Select Court 5"
                >
                    Court 5
                </button>
            </div>
            <div style={{ display: 'flex', gap: '10px', padding: '5px 0px' }}>
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
                    style={{ padding: '2px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
                    aria-label="Select Court 1"
                >
                    Enter
                </button>
            </div>
            <div style={{ display: 'flex', gap: '5px', padding: '20px 0px' }}>
                Door is: <span style={{ color: doorOpen === 'Open' ? 'green' : 'red'}}>{doorOpen}</span>
            </div>
            </div>
        </div>
    )
}