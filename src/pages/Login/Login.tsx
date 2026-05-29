import { Link, useNavigate } from '@tanstack/react-router'
import './Login.css'

export function Login() {
  const navigate = useNavigate()

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Please enter your details to sign in.</p>
        
        <form className="login-form" onSubmit={(e) => { 
          e.preventDefault()
          navigate({ to: '/dashboard' })
        }}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className="login-button">Sign In</button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
