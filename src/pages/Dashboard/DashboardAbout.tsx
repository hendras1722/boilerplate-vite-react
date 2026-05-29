import { About } from '../About/About'

export function DashboardAbout() {
  return (
    <div className="glass-card">
      <div className="glass-card-title" style={{ marginBottom: '1rem' }}>
        <h3>About the Dashboard</h3>
      </div>
      <div style={{ lineHeight: '1.6' }}>
        <About />
        <p style={{ marginTop: '1rem' }}>
          This is the dashboard specific about page. It reuses the global About component, but adds dashboard-specific context.
        </p>
      </div>
    </div>
  )
}
