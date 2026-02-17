import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide'

    const variants = {
      primary: 'bg-primary-500 text-cream-100 border border-primary-500 hover:bg-primary-600 focus:ring-primary-500',
      secondary: 'bg-cream-100 text-primary-500 border border-primary-500 hover:bg-cream-200 focus:ring-primary-500',
      outline: 'bg-transparent text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-cream-100 focus:ring-primary-500',
      ghost: 'text-primary-500 hover:bg-cream-200 focus:ring-primary-500 border border-transparent'
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }