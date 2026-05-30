import { Link, useNavigate } from '@tanstack/react-router'
import { InputField } from '../../components/ui/InputField'
import { Button } from '../../components/ui/Button'
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
          <InputField 
            type="email" 
            id="email" 
            label="Email" 
            placeholder="Enter your email" 
            required 
            className="text-white"
          />
          <InputField 
            type="password" 
            id="password" 
            label="Password" 
            placeholder="••••••••" 
            required 
            className="text-white"
          />
          <Button 
            type="submit" 
            className="login-button mt-4 w-full justify-center"
          >
            Sign In
          </Button>
        </form>
        
        <div className="mt-8 text-center text-[0.85rem]">
          <Link to="/" className="text-white/70 no-underline hover:text-white transition-colors">&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  )
}


