import { type ReactNode } from 'react'
import { Logo } from '../ui/Logo'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Logo size="lg" className="mb-8" />
          <h1 className="text-4xl font-bold text-foreground leading-tight mb-4">
            Seu espaço pessoal<br />na nuvem
          </h1>
          <p className="text-lg text-muted max-w-md">
            Armazene, organize e acesse seus arquivos de qualquer lugar com segurança e simplicidade.
          </p>
          <div className="mt-12 flex gap-8">
            <div>
              <p className="text-3xl font-bold text-foreground">10GB</p>
              <p className="text-sm text-muted">Gratuito</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">256-bit</p>
              <p className="text-sm text-muted">Criptografia</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">99.9%</p>
              <p className="text-sm text-muted">Uptime</p>
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
            <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
            <p className="text-muted">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
