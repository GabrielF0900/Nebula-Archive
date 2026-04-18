import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/layouts/AuthLayout'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(formData.email, formData.senha)
      navigate('/dashboard')
    } catch {
      setError('E-mail ou senha incorretos. Tente: demo@nebula.com / demo123')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta para acessar seus arquivos"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div 
            className="p-3 rounded-lg text-sm" 
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444'
            }}
            role="alert"
          >
            {error}
          </div>
        )}

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
          autoComplete="email"
        />

        <Input
          label="Senha"
          type="password"
          placeholder="Sua senha"
          value={formData.senha}
          onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
          required
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link
            to="/recuperar-senha"
            className="text-sm transition-colors"
            style={{ color: '#6366f1' }}
          >
            Esqueceu a senha?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Entrar
        </Button>

        <p className="text-center text-sm" style={{ color: '#8888a0' }}>
          Nao tem uma conta?{' '}
          <Link to="/registro" className="font-medium transition-colors" style={{ color: '#6366f1' }}>
            Criar conta
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
