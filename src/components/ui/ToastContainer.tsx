import { useToast } from '../../hooks/useToast'
import type { ToastItem } from '../../hooks/useToast'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

function ToastIcon({ color }: { color?: ToastItem['color'] }) {
  switch (color) {
    case 'success':
      return <CheckCircle size={18} style={{ color: '#10b981' }} />
    case 'error':
      return <AlertCircle size={18} style={{ color: '#ef4444' }} />
    case 'warning':
      return <AlertTriangle size={18} style={{ color: '#f59e0b' }} />
    case 'info':
    default:
      return <Info size={18} style={{ color: '#3b82f6' }} />
  }
}

export function ToastContainer() {
  const { toasts, remove } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="toast-container" aria-live="assertive">
      {toasts.map((toast) => {
        const itemClass = `toast-item toast-${toast.color || 'info'}`
        return (
          <div key={toast.id} className={itemClass}>
            <div className="toast-item-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ToastIcon color={toast.color} />
                <span className="toast-title">{toast.title || (toast.color ? toast.color.charAt(0).toUpperCase() + toast.color.slice(1) : 'Notification')}</span>
              </div>
              <button
                className="toast-close"
                onClick={() => remove(toast.id)}
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
            </div>
            {toast.description && (
              <span className="toast-description">{toast.description}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
