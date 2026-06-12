import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Account() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const displayName = session?.user?.user_metadata?.display_name || 'Unknown'
  const phone = session?.user?.user_metadata?.phone || 'Unknown'

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Account</h1>

      {loading && <p>Loading user details…</p>}

      {!loading && !session && (
        <div>
          <p>You are not signed in.</p>
          <Link to="/login">Go to login</Link>
        </div>
      )}

      {!loading && session && (
        <div style={{ maxWidth: 520, padding: '1.5rem', border: '1px solid #ddd', borderRadius: 10, background: '#fafafa' }}>
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
        </div>
      )}
    </main>
  )
}
