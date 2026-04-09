import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #1a2744 100%)',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '8rem',
        fontWeight: 800,
        margin: 0,
        background: 'linear-gradient(135deg, #6c63ff, #e091f5)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>404</h1>
      <p style={{
        fontSize: '1.4rem',
        color: '#94a3b8',
        marginBottom: '2rem'
      }}>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" style={{
        padding: '0.75rem 2rem',
        background: 'linear-gradient(135deg, #6c63ff, #e091f5)',
        color: '#fff',
        borderRadius: '12px',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '1rem',
        transition: 'opacity 0.2s'
      }}>
        Go Home
      </Link>
    </div>
  )
}
