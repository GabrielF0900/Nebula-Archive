export interface User {
  id: string
  nome: string
  email: string
  avatarUrl?: string
  criadoEm: string
}

export interface Arquivo {
  id: string
  nome: string
  tamanho: number
  tipo: string
  url: string
  criadoEm: string
  usuarioId: string
}

export interface UploadProgress {
  id: string
  nome: string
  progresso: number
  status: 'uploading' | 'completed' | 'error'
  erro?: string
}

export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
