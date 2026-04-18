import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/layouts/AuthLayout'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  })

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (formData.nome.length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido'
    }

    if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      await register(formData.nome, formData.email, formData.senha)
      navigate('/dashboard')
    } catch {
      setErrors({ form: 'Erro ao criar conta. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Comece a armazenar seus arquivos com segurança"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.form && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error" role="alert">
            {errors.form}
          </div>
        )}

        <Input
          label="Nome"
          type="text"
          placeholder="Seu nome"
          value={formData.nome}
          onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
          error={errors.nome}
          required
          autoComplete="name"
        />

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          error={errors.email}
          required
          autoComplete="email"
        />

        <Input
          label="Senha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={formData.senha}
          onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
          error={errors.senha}
          required
          autoComplete="new-password"
        />

        <Input
          label="Confirmar senha"
          type="password"
          placeholder="Repita a senha"
          value={formData.confirmarSenha}
          onChange={(e) => setFormData(prev => ({ ...prev, confirmarSenha: e.target.value }))}
          error={errors.confirmarSenha}
          required
          autoComplete="new-password"
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Criar conta
        </Button>

        <p className="text-center text-sm text-muted">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
            Entrar
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
