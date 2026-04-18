import { type InputHTMLAttributes, forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  type,
  label,
  error,
  hint,
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-')
  const isPassword = type === 'password'

  return (
    <div className="space-y-1.5">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium"
          style={{ color: '#f0f0f5' }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={isPassword && showPassword ? 'text' : type}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg transition-colors duration-200',
            'focus:outline-none focus:ring-1',
            isPassword && 'pr-10',
            className
          )}
          style={{
            backgroundColor: '#12121a',
            border: `1px solid ${error ? '#ef4444' : '#2a2a3a'}`,
            color: '#f0f0f5',
          }}
          placeholder={props.placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: '#8888a0' }}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-sm" style={{ color: '#ef4444' }} role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-sm" style={{ color: '#8888a0' }}>
          {hint}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export { Input }
