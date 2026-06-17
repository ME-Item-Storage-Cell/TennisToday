import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

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

  const handleCourtBookingClick = (e) => {
    if (!session) {
      e.preventDefault()
      navigate('/login')
    }
  }

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: '#f2f2f2',
      borderBottom: '1px solid #ddd',
    }}>
      <div style={{ fontWeight: 700 }}>TennisToday</div>
      <div>
        <Link to="/" style={{ marginRight: '1rem', textDecoration: 'none', color: '#333' }}>
          Home
        </Link>
        <Link 
          to="/court-booking" 
          onClick={handleCourtBookingClick}
          style={{ marginRight: '1rem', textDecoration: 'none', color: '#333', cursor: 'pointer' }}
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
