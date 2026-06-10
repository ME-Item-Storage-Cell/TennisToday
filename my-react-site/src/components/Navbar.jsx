import { Link } from 'react-router-dom'

export default function Navbar() {
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
        <Link to="/login" style={{ padding: '0.5rem 1rem', background: '#007bff', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
          Login
        </Link>
      </div>
    </nav>
  )
}
