import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Account() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

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

  useEffect(() => {
    if (!loading && !session) {
      navigate('/login', { replace: true })
    }
  }, [loading, session, navigate])

  const displayName = session?.user?.user_metadata?.display_name || 'Unknown'
  const phone = session?.user?.user_metadata?.phone || 'Unknown'

  return (
    <main style={{ padding: '2rem' }}>
      <div className='accountContainer'>
        <div className='accountBox'>
        <h1 className='pageHeading'>Your Account</h1>

        {loading && <p>Loading user details…</p>}

        {!loading && !session && (
          <div>
            <p>You are not signed in.</p>
            <Link to="/login">Go to login</Link>
          </div>
        )}

        {!loading && session && (
          <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: 10, background: '#fafafa' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <strong>Display name:</strong>
              <div>{displayName}</div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <strong>Email:</strong>
              <div>{session.user.email}</div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <strong>Phone:</strong>
              <div>{phone}</div>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button
              type="button"
              onClick={async () => {
                setLoading(true)
                setError('')
                const { error } = await supabase.auth.signOut()
                if (error) {
                  setError(error.message)
                  setLoading(false)
                } else {
                  navigate('/login', { replace: true })
                }
              }}
              disabled={loading}
              style={{ marginTop: '1rem' }}
            >
              Sign out
            </button>
          </div>
        )}
        </div>
      </div>
    </main>
  )
}
