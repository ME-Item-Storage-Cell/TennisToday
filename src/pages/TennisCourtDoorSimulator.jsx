import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function TennisCourtDoorSimulator() {
    const [courtChoice, setCourtChoice] = useState('')
    const [bookingCode, setBookingCode] = useState('')

    useEffect(() => {
        console.log("Court choice:" + courtChoice)
    }, [courtChoice])

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
                        return
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