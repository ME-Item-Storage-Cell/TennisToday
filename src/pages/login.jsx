import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import './PageStyling.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
  }, [isSigningUp])

  useEffect(() => {
    let isMounted = true

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        if (error.code === '422') {
          setError("Weak Password")
        } else {
          setError(error.message)
        }
        
      } else if (data.session) {
        navigate('/account', { replace: true })
      }
      if (isMounted) {
        setLoading(false)
      }
    }

    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_, currentSession) => {
      if (currentSession) {
        navigate('/account', { replace: true })
      }
    })

    return () => {
      isMounted = false
      authListener?.subscription?.unsubscribe()
    }
  }, [navigate])

  async function signUp() {
    setLoading(true)
    setMessage('')
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          phone,
        },
      },
    })

    if (error) {
      if (error.code === "weak_password") {
        setError("Password too weak, should contain at least 1 letter (lowercase and capital), 1 number, and 1 symbol. Must be at least 6 characters long.")
      } else {
        setError(error.message)
      }
      
    } else {
      setMessage('Check your email for confirmation')
    }

    setLoading(false)
  }

  async function signIn() {
    setLoading(true)
    setMessage('')
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/account', { replace: true })
    }
  }

  return (
    <div className='loginContainer'>
      <div className='loginBox'>
        {isSigningUp ? <h1>Sign Up</h1> : <h1>Login</h1> }

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isSigningUp && (
          <>
            <input
              type="text"
              placeholder="Display Name (Optional)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <input
              type="tel"
              placeholder="Phone Number (Optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </>
        )}

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {isSigningUp ? (
          <>
            <button type="button" onClick={signUp} disabled={loading}>
              Create account
            </button>
            <button type="button" onClick={() => setIsSigningUp(false)} disabled={loading}>
              Switch to Log in
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={signIn} disabled={loading}>
              Log in
            </button>
            <button type="button" onClick={() => setIsSigningUp(true)} disabled={loading}>
              Switch to Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  )
}