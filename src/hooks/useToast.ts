import { create } from 'zustand'

export interface ToastItem {
  id: string
  title?: string
  description?: string
  color?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastStore {
  toasts: ToastItem[]
  add: (toast: Omit<ToastItem, 'id'>) => string
  remove: (id: string) => void
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  add: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: ToastItem = { ...toast, id }
    set((state) => ({ toasts: [...state.toasts, newToast] }))

    const duration = toast.duration ?? 4000
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
      }, duration)
    }

    return id
  },
  remove: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },
}))

export const toast = {
  add: (item: Omit<ToastItem, 'id'>) => useToast.getState().add(item),
  remove: (id: string) => useToast.getState().remove(id),
  success: (description: string, title = 'Success', duration = 4000) => 
    useToast.getState().add({ title, description, color: 'success', duration }),
  error: (description: string, title = 'Error', duration = 4000) => 
    useToast.getState().add({ title, description, color: 'error', duration }),
  warning: (description: string, title = 'Warning', duration = 4000) => 
    useToast.getState().add({ title, description, color: 'warning', duration }),
  info: (description: string, title = 'Info', duration = 4000) => 
    useToast.getState().add({ title, description, color: 'info', duration }),
}
