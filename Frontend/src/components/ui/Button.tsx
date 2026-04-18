import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  children,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover active:scale-[0.98]',
    secondary: 'bg-surface text-foreground border border-border hover:bg-surface-hover active:scale-[0.98]',
    ghost: 'text-muted hover:text-foreground hover:bg-surface-hover',
    danger: 'bg-error text-white hover:bg-error/90 active:scale-[0.98]'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2'
  }

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export { Button }
