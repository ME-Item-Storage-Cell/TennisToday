import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function MyBookings() {
    const [current, setCurrent] = useState(true)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [userBookings, setUserBookings] = useState([])
    const navigate = useNavigate()
    const getTodayString = () => {
        const today = new Date()
        return today.toISOString()
    }

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

    useEffect(() => {
        if (!loading && !session) {
        navigate('/login', { replace: true })
        }
    }, [loading, session, navigate])


    useEffect(() => {
        const fetchUserBookings = async () => {
            console.log('[MyBookings] Fetching bookings - current:', current, 'session:', session)
            const { data, error } = await (
            current
                ? supabase
                    .from('Venue1_Bookings')
                    .select('*')
                    .eq('Booker', session.user.id)
                    .gt('BookingTime', getTodayString())
                    .order('BookingTime', {ascending: true})
                : supabase
                    .from('Venue1_Bookings')
                    .select('*')
                    .eq('Booker', session.user.id)
                    .lt('BookingTime', getTodayString())
                    .order('BookingTime', {ascending: false})

            );

            if (error) {
                console.error('[MyBookings] Fetch bookings error:', error)
                setError(error.message)
                return
            }

            console.log('[MyBookings] Bookings fetched:', data)
            setUserBookings(data)
        }

        fetchUserBookings()
    }, [current, session])

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading...</div>
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>My Bookings</h1>
            
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <button
                    onClick={() => {
                        console.log('[MyBookings] Toggle button clicked - current was:', current)
                        setCurrent(!current)
                    }}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: current ? '#007bff' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {current ? 'Show Past Bookings' : 'Show Current Bookings'}
                </button>
            </div>

            {error && (
                <div style={{ padding: '12px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '20px' }}>
                    {error}
                </div>
            )}

            {userBookings.length === 0 ? (
                <p>No {current ? 'current' : 'past'} bookings found.</p>
            ) : (
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginTop: '20px'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{
                                border: '1px solid #ddd',
                                padding: '12px',
                                fontWeight: 'bold',
                                textAlign: 'left'
                            }}>
                                Court
                            </th>
                            <th style={{
                                border: '1px solid #ddd',
                                padding: '12px',
                                fontWeight: 'bold',
                                textAlign: 'left'
                            }}>
                                Booking Time
                            </th>
                            <th style={{
                                border: '1px solid #ddd',
                                padding: '12px',
                                fontWeight: 'bold',
                                textAlign: 'left'
                            }}>
                                Booking Code
                            </th>
                            <th style={{
                                border: '1px solid #ddd',
                                padding: '12px',
                                fontWeight: 'bold',
                                textAlign: 'left'
                            }}>
                                Equipment
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {userBookings.map((booking) => (
                            <tr key={booking.id}>
                                <td style={{
                                    border: '1px solid #ddd',
                                    padding: '12px'
                                }}>
                                    Court {booking.CourtNum}
                                </td>
                                <td style={{
                                    border: '1px solid #ddd',
                                    padding: '12px'
                                }}>
                                    {formatDate(booking.BookingTime)}
                                </td>
                                <td style={{
                                    border: '1px solid #ddd',
                                    padding: '12px'
                                }}>
                                    {booking.BookingCode}
                                </td>
                                <td style={{
                                    border: '1px solid #ddd',
                                    padding: '12px'
                                }}>
                                    {booking.bookedEquipment ? 'Yes' : 'No'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}