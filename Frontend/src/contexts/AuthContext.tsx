import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User, AuthState } from '../types'

interface AuthContextType extends AuthState {
  login: (email: string, senha: string) => Promise<void>
  register: (nome: string, email: string, senha: string) => Promise<void>
  logout: () => void
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('nebula_user')
    if (storedUser) {
      setState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        isLoading: false,
      })
    } else {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (email: string, senha: string) => {
    // Simulação de login - substituir por chamada real à API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email === 'demo@nebula.com' && senha === 'demo123') {
      const user: User = {
        id: '1',
        nome: 'Usuário Demo',
        email: email,
        criadoEm: new Date().toISOString(),
      }
      localStorage.setItem('nebula_user', JSON.stringify(user))
      setState({ user, isAuthenticated: true, isLoading: false })
    } else {
      throw new Error('Credenciais inválidas')
    }
  }

  const register = async (nome: string, email: string, senha: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user: User = {
      id: Date.now().toString(),
      nome,
      email,
      criadoEm: new Date().toISOString(),
    }
    localStorage.setItem('nebula_user', JSON.stringify(user))
    setState({ user, isAuthenticated: true, isLoading: false })
  }

  const logout = () => {
    localStorage.removeItem('nebula_user')
    localStorage.removeItem('nebula_arquivos')
    setState({ user: null, isAuthenticated: false, isLoading: false })
  }

  const resetPassword = async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Simulação - em produção, enviaria e-mail de recuperação
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}
