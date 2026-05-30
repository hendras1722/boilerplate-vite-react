import { create } from 'zustand'

export interface AuthState {
  token?: string
  refresh_token?: string
  expires_at?: number
}

interface AuthStore {
  state: AuthState
  setState: (newState: AuthState | ((prev: AuthState) => AuthState)) => void
  clear: () => void
}

export const useAuth = create<AuthStore>((set) => ({
  state: {
    token: localStorage.getItem('auth_token') || undefined,
    refresh_token: localStorage.getItem('auth_refresh_token') || undefined,
    expires_at: localStorage.getItem('auth_expires_at') ? Number(localStorage.getItem('auth_expires_at')) : undefined,
  },
  setState: (newState) => {
    set((prev) => {
      const resolvedState = typeof newState === 'function' ? newState(prev.state) : newState

      if (resolvedState.token) {
        localStorage.setItem('auth_token', resolvedState.token)
      } else {
        localStorage.removeItem('auth_token')
      }

      if (resolvedState.refresh_token) {
        localStorage.setItem('auth_refresh_token', resolvedState.refresh_token)
      } else {
        localStorage.removeItem('auth_refresh_token')
      }

      if (resolvedState.expires_at) {
        localStorage.setItem('auth_expires_at', String(resolvedState.expires_at))
      } else {
        localStorage.removeItem('auth_expires_at')
      }

      return { state: resolvedState }
    })
  },
  clear: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_refresh_token')
    localStorage.removeItem('auth_expires_at')
    set({ state: {} })
  },
}))
