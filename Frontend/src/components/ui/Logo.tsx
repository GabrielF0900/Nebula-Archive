import { cn } from '../../utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'md', className }: LogoProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-white"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="21.17" y1="8" x2="12" y2="8" />
            <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
            <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
          </svg>
        </div>
        <div 
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse" 
          style={{ backgroundColor: '#22d3ee' }}
        />
      </div>
      <span className={cn('font-bold tracking-tight', sizes[size])} style={{ color: '#f0f0f5' }}>
        Nebula<span style={{ color: '#6366f1' }}>Archive</span>
      </span>
    </div>
  )
}
