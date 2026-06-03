import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Login from './Login'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return <Login />
  }

  return (
    <div>
      <h1>Welcome!</h1>
      <button
        onClick={() => supabase.auth.signOut()}
      >
        Sign Out
      </button>
    </div>
  )
}

export default App