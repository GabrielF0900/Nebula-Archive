import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'
import { AuthLayout } from '../components/layouts/AuthLayout'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await resetPassword(email)
      setIsSuccess(true)
    } catch {
      setError('Erro ao enviar e-mail. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <AuthLayout
        title="E-mail enviado"
        subtitle="Verifique sua caixa de entrada"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-success" />
          </div>
          <p className="text-muted mb-6">
            Enviamos um link de recuperação para <span className="text-foreground font-medium">{email}</span>. 
            Verifique também a pasta de spam.
          </p>
          <Link to="/login">
            <Button variant="secondary" className="w-full">
              Voltar ao login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle="Digite seu e-mail para receber um link de recuperação"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error" role="alert">
            {error}
          </div>
        )}

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Enviar link de recuperação
        </Button>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar ao login
        </Link>
      </form>
    </AuthLayout>
  )
}
