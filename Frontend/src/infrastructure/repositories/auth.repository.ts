import type { IAuthRepository } from '@domain/repositories'
import type { User, LoginCredentials, RegisterCredentials } from '@domain/entities'

// Simulated user storage (in production, this would be an API call)
const STORAGE_KEY = 'nebula_users'
const SESSION_KEY = 'nebula_session'

const getStoredUsers = (): Array<User & { password: string }> => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

const storeUser = (user: User & { password: string }) => {
  const users = getStoredUsers()
  users.push(user)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

const setSession = (user: User) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY)
}

const getSession = (): User | null => {
  const data = localStorage.getItem(SESSION_KEY)
  return data ? JSON.parse(data) : null
}

// Simulated delay for realistic UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<User> {
    await delay(800)
    
    const users = getStoredUsers()
    const user = users.find(u => u.email === credentials.email)
    
    if (!user) {
      throw new Error('Usuário não encontrado')
    }
    
    if (user.password !== credentials.password) {
      throw new Error('Senha incorreta')
    }
    
    const { password: _, ...userWithoutPassword } = user
    setSession(userWithoutPassword)
    
    return userWithoutPassword
  }

  async register(credentials: RegisterCredentials): Promise<User> {
    await delay(1000)
    
    const users = getStoredUsers()
    const existingUser = users.find(u => u.email === credentials.email)
    
    if (existingUser) {
      throw new Error('Email já cadastrado')
    }
    
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Senhas não conferem')
    }
    
    const newUser: User & { password: string } = {
      id: crypto.randomUUID(),
      email: credentials.email,
      name: credentials.name,
      role: 'user',
      createdAt: new Date(),
      password: credentials.password,
    }
    
    storeUser(newUser)
    
    const { password: _, ...userWithoutPassword } = newUser
    setSession(userWithoutPassword)
    
    return userWithoutPassword
  }

  async logout(): Promise<void> {
    await delay(300)
    clearSession()
  }

  async getCurrentUser(): Promise<User | null> {
    await delay(200)
    return getSession()
  }

  async resetPassword(email: string): Promise<void> {
    await delay(1000)
    
    const users = getStoredUsers()
    const user = users.find(u => u.email === email)
    
    if (!user) {
      throw new Error('Email não encontrado')
    }
    
    // In production, this would send an email
    console.log(`[Nebula] Password reset email sent to: ${email}`)
  }
}

export const authRepository = new AuthRepository()
