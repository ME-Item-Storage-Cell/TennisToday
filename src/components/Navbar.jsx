import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import './ComponentStyling.css' 

export default function Navbar() {
  const [session, setSession] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }

    loadSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_, currentSession) => {
      setSession(currentSession)
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: '#ffffff',
      borderBottom: '1px solid #ddd',
    }}>
      <div> 
        <Link to="/" style={{ marginRight: '1rem', textDecoration: 'none', color: '#333', fontWeight: 'bolder'}}>
          TennisToday
        </Link>
      </div>
      <div className='navLinks'>
        <Link to="/tennis-court-door-simulation" style={{ marginRight: '1rem', textDecoration: 'none', color: '#333', cursor: 'pointer' }}
        >
          Tennis Court Door
        </Link>
        <Link to="/my-bookings" style={{ marginRight: '1rem', textDecoration: 'none', color: '#333', cursor: 'pointer' }}
        >
          My Bookings
        </Link>
        <Link 
          to="/court-booking" style={{ marginRight: '1rem', textDecoration: 'none', color: '#333', cursor: 'pointer' }}
        >
          Court Booking
        </Link>
        {session ? (
          <Link to="/account" style={{ padding: '0.5rem 1rem', background: '#007bff', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
            Account
          </Link>
        ) : (
          <Link to="/login" style={{ padding: '0.5rem 1rem', background: '#007bff', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
