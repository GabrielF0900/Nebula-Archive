import { type ReactNode } from 'react'
import { Logo } from '../ui/Logo'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0a0a0f' }}>
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#12121a' }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)' }} />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Logo size="lg" className="mb-8" />
          <h1 className="text-4xl font-bold leading-tight mb-4" style={{ color: '#f0f0f5' }}>
            Seu espaco pessoal<br />na nuvem
          </h1>
          <p className="text-lg max-w-md" style={{ color: '#8888a0' }}>
            Armazene, organize e acesse seus arquivos de qualquer lugar com seguranca e simplicidade.
          </p>
          <div className="mt-12 flex gap-8">
            <div>
              <p className="text-3xl font-bold" style={{ color: '#f0f0f5' }}>10GB</p>
              <p className="text-sm" style={{ color: '#8888a0' }}>Gratuito</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: '#f0f0f5' }}>256-bit</p>
              <p className="text-sm" style={{ color: '#8888a0' }}>Criptografia</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: '#f0f0f5' }}>99.9%</p>
              <p className="text-sm" style={{ color: '#8888a0' }}>Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo size="md" className="justify-center" />
          </div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#f0f0f5' }}>{title}</h2>
            <p style={{ color: '#8888a0' }}>{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
