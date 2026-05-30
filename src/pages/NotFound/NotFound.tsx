import { Link, useRouter } from '@tanstack/react-router'
import { Button } from '../../components/ui/Button'
import './NotFound.css'

export function NotFound() {
  const router = useRouter()

  return (
    <div className="not-found-container">
      {/* Background glow effects */}
      <div className="glow-orb glow-orb-1"></div>
      <div className="glow-orb glow-orb-2"></div>
      
      <div className="not-found-content">
        {/* Animated 404 Illustration */}
        <div className="illustration-container">
          <div className="digit-glow">404</div>
          <div className="floating-astronaut">
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="astronaut-svg">
              {/* Helmet */}
              <rect x="30" y="30" width="60" height="54" rx="27" fill="url(#helmet-grad)" stroke="currentColor" strokeWidth="4" />
              <rect x="38" y="36" width="44" height="34" rx="17" fill="#1e1f29" stroke="currentColor" strokeWidth="2.5" />
              {/* Visor Reflection */}
              <path d="M44 42C48 38 60 38 66 40" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="3" strokeLinecap="round" />
              {/* Suit elements */}
              <path d="M40 84C40 84 25 90 25 100C25 105 35 105 35 105H85C85 105 95 105 95 100C95 90 80 84 80 84" fill="url(#suit-grad)" stroke="currentColor" strokeWidth="4" />
              {/* Antenna */}
              <line x1="60" y1="30" x2="60" y2="15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <circle cx="60" cy="12" r="5" fill="#aa3bff" className="antenna-glow" />
              
              {/* Defs */}
              <defs>
                <linearGradient id="helmet-grad" x1="30" y1="30" x2="90" y2="84" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#f4f3ec" />
                </linearGradient>
                <linearGradient id="suit-grad" x1="25" y1="84" x2="95" y2="105" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#e5e4e7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Text Details */}
        <h1 className="not-found-title">Waduh! Tersesat Ya?</h1>
        <p className="not-found-message">
          Halaman yang Anda cari tidak dapat ditemukan. Mungkin alamatnya salah, 
          atau halaman ini telah dipindahkan ke tempat lain.
        </p>

        {/* Action Buttons */}
        <div className="action-buttons-group">
          <Link to="/" className="btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Kembali ke Beranda
          </Link>

          <Link to="/dashboard" className="btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            Dashboard
          </Link>

          <Button onClick={() => router.history.back()} className="btn-tertiary" variant="ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Kembali
          </Button>
        </div>
      </div>
    </div>
  )
}
