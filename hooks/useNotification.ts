import { create } from 'zustand'
import { NotificationState } from '@/lib/types'

interface NotificationStore extends NotificationState {
  showNotification: (message: string, type: NotificationState['type']) => void
  hideNotification: () => void
}

export const useNotification = create<NotificationStore>((set) => ({
  message: '',
  type: 'info',
  isVisible: false,
  showNotification: (message, type) => {
    set({ message, type, isVisible: true })
    setTimeout(() => {
      set({ isVisible: false })
    }, 5000)
  },
  hideNotification: () => set({ isVisible: false }),
}))