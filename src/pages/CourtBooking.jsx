import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function CourtBooking() {
    const navigate = useNavigate()
    const tableRef = useRef(null)
    const [timeSlot, setTimeSlot] = useState(0)
    
    // Get today's date in YYYY-MM-DD format
    const getTodayString = () => {
        const today = new Date()
        return today.toISOString().split('T')[0]
    }
    
    const [selectedDate, setSelectedDate] = useState(getTodayString())
    
    const COURTS = [1, 2, 3, 4, 5]
    const START_HOUR = 6
    const END_HOUR = 19
    const TOTAL_SLOTS = (END_HOUR - START_HOUR) * 2
    const [currentBookings, setCurrentBookings] = useState([])
    const [error, setError] = useState('')
    const [session, setSession] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })
    }, [])
    
    // Calculate the minimum valid time slot based on current date and time
    const getMinTimeSlot = () => {
        if (selectedDate !== getTodayString()) {
            // If date is in the future, all slots are valid
            return 0
        }
        
        // If date is today, calculate current time and find first valid slot
        const now = new Date()
        const currentHours = now.getHours()
        const currentMinutes = now.getMinutes()
        const currentTotalMinutes = currentHours * 60 + currentMinutes
        
        // Calculate which slot we're currently in
        const startTotalMinutes = START_HOUR * 60
        const minutesSinceStart = currentTotalMinutes - startTotalMinutes
        
        // If current time is before 6 AM, start from slot 0
        if (minutesSinceStart < 0) {
            return 0
        }
        
        // Calculate slot and round up to next slot if not exactly on a boundary
        const currentSlot = minutesSinceStart / 30
        const minSlot = Math.ceil(currentSlot)
        
        // Return the minimum slot, capped at TOTAL_SLOTS - 1
        return Math.min(minSlot, TOTAL_SLOTS - 1)
    }
    
    const getTimeString = (slot) => {
        const totalMinutes = START_HOUR * 60 + slot * 30
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    }
    
    const getTimeRange = (slot) => {
        const startTime = getTimeString(slot)
        const totalMinutes = START_HOUR * 60 + slot * 30 + 30
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        const endTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
        return `${startTime} - ${endTime}`
    }

    const handleSlotClick = (court) => {
        if (!session) {
                setError('Please log in first');
                setTimeout(() => {
                  navigate('/login');
                }, 500);
                return;
            }
        navigate('/booking', {
            state: {
                court,
                date: selectedDate,
                startTime: getTimeString(timeSlot),
                endTime: getTimeString(timeSlot + 1),
                timeRange: getTimeRange(timeSlot),
            }
        })
    }
    
    const handleWheel = useCallback((e) => {
        e.preventDefault()
        const minSlot = getMinTimeSlot()

        if (e.deltaY > 0) {
            // Scroll down - move to later time
            setTimeSlot(prev => Math.min(prev + 1, TOTAL_SLOTS - 1))
        } else if (e.deltaY < 0) {
            // Scroll up - move to earlier time
            setTimeSlot(prev => Math.max(prev - 1, minSlot))
        }
    }, [TOTAL_SLOTS, selectedDate])

    const handlePreviousSlot = () => {
        const minSlot = getMinTimeSlot()
        setTimeSlot(prev => Math.max(prev - 1, minSlot))
    }

    const handleNextSlot = () => {
        setTimeSlot(prev => Math.min(prev + 1, TOTAL_SLOTS - 1))
    }
    
    useEffect(() => {
        const table = tableRef.current
        if (table) {
            table.addEventListener('wheel', handleWheel, { passive: false })
            return () => table.removeEventListener('wheel', handleWheel)
        }
    }, [handleWheel])
    
    // Reset timeSlot when date changes to ensure it's always valid
    useEffect(() => {
        setTimeSlot(getMinTimeSlot())
    }, [selectedDate])

    useEffect(() => {
        const fetchBookings = async () => {
            const { data, error } = await supabase
                .from("Venue1_Bookings")
                .select("*")

            if (error) {
                setError(error)
                return
            }

            setCurrentBookings(data)
        }

        fetchBookings()

    }, [selectedDate])

    return (
        <div style={{ padding: '20px' }}>
            <h1>Court Booking</h1>
            
            <div style={{ marginTop: '15px', marginBottom: '20px' }}>
                <label htmlFor="date-picker" style={{ fontWeight: 'bold', marginRight: '10px' }}>
                    Select Date:
                </label>
                <input
                    id="date-picker"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getTodayString()}
                    style={{
                        padding: '8px 12px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <p style={{ margin: 0 }}>Current time slot: {getTimeRange(timeSlot)}</p>
                <button
                    onClick={handlePreviousSlot}
                    disabled={timeSlot === getMinTimeSlot()}
                    style={{
                        padding: '8px 16px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: timeSlot === getMinTimeSlot() ? 'not-allowed' : 'pointer',
                        backgroundColor: timeSlot === getMinTimeSlot() ? '#f0f0f0' : '#ffffff'
                    }}
                >
                    ←
                </button>
                
                <button
                    onClick={handleNextSlot}
                    disabled={timeSlot === TOTAL_SLOTS - 1}
                    style={{
                        padding: '8px 16px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: timeSlot === TOTAL_SLOTS - 1 ? 'not-allowed' : 'pointer',
                        backgroundColor: timeSlot === TOTAL_SLOTS - 1 ? '#f0f0f0' : '#ffffff'
                    }}
                >
                    →
                </button>
            </div>
            
            <div
                ref={tableRef}
                style={{
                    overflowX: 'auto',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    marginTop: '20px'
                }}
            >
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: '500px'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{
                                border: '1px solid #ddd',
                                padding: '12px',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}>
                                Time
                            </th>
                            {COURTS.map(court => (
                                <th
                                    key={court}
                                    style={{
                                        border: '1px solid #ddd',
                                        padding: '12px',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        backgroundColor: '#e8f4f8'
                                    }}
                                >
                                    Court {court}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{
                                border: '1px solid #ddd',
                                padding: '12px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                backgroundColor: '#f9f9f9'
                            }}>
                                {getTimeRange(timeSlot)}
                            </td>
                            {COURTS.map(court => (
                                <td
                                    key={`${timeSlot}-${court}`}
                                    data-court={court}
                                    data-time-slot={timeSlot}
                                    data-start-time={getTimeString(timeSlot)}
                                    data-end-time={getTimeString(timeSlot + 1)}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleSlotClick(court)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            handleSlotClick(court)
                                        }
                                    }}
                                    style={{
                                        border: '1px solid #ddd',
                                        padding: '12px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        backgroundColor: '#ffffff',
                                        transition: 'background-color 0.2s',
                                        userSelect: 'none'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e8f4f8'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                                >
                                    Book
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                Use scroll wheel to navigate through time slots (6:00 AM - 7:00 PM)
            </p>
        </div>
    )
}