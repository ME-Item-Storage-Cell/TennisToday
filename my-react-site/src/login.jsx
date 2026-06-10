import { useState } from 'react'
import { supabase } from './supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [loading, setLoading] = useState(false)

  async function signUp() {
    setLoading(true)

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
      alert(error.message)
    } else {
      alert('Check your email for confirmation')
    }

    setLoading(false)
  }

  async function signIn() {
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    }

    setLoading(false)
  }

  return (
    <div>
      <h1>Login</h1>

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
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </>
      )}

      {isSigningUp ? (
        <>
          <button onClick={signUp} disabled={loading}>
            Create account
          </button>
          <button type="button" onClick={() => setIsSigningUp(false)} disabled={loading}>
            Switch to Sign In
          </button>
        </>
      ) : (
        <>
          <button onClick={signIn} disabled={loading}>
            Sign In
          </button>
          <button type="button" onClick={() => setIsSigningUp(true)} disabled={loading}>
            Switch to Sign Up
          </button>
        </>
      )}
    </div>
  )
}