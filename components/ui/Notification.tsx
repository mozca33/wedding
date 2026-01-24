import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { useNotification } from '@/hooks/useNotification'
import { cn } from '@/lib/utils'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
}

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

export const Notification = () => {
  const { message, type, isVisible, hideNotification } = useNotification()

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideNotification()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, hideNotification])

  if (!isVisible) return null

  const Icon = icons[type]

  const notificationContent = (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={cn(
        'flex items-center p-4 border rounded-lg shadow-lg max-w-sm',
        styles[type]
      )}>
        <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={hideNotification}
          className="ml-3 text-current hover:opacity-70 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )

  return createPortal(notificationContent, document.body)
}