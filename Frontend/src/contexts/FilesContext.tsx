import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Arquivo, UploadProgress } from '../types'

interface FilesContextType {
  arquivos: Arquivo[]
  uploads: UploadProgress[]
  isLoading: boolean
  uploadFiles: (files: FileList) => void
  deleteFile: (id: string) => void
  downloadFile: (arquivo: Arquivo) => void
}

const FilesContext = createContext<FilesContextType | null>(null)

export function useFiles() {
  const context = useContext(FilesContext)
  if (!context) {
    throw new Error('useFiles must be used within a FilesProvider')
  }
  return context
}

interface FilesProviderProps {
  children: ReactNode
}

export function FilesProvider({ children }: FilesProviderProps) {
  const [arquivos, setArquivos] = useState<Arquivo[]>([])
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('nebula_arquivos')
    if (stored) {
      setArquivos(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('nebula_arquivos', JSON.stringify(arquivos))
    }
  }, [arquivos, isLoading])

  const uploadFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      setUploads(prev => [...prev, {
        id: uploadId,
        nome: file.name,
        progresso: 0,
        status: 'uploading'
      }])

      // Simular progresso de upload
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 20
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          
          // Criar URL do arquivo
          const reader = new FileReader()
          reader.onload = () => {
            const novoArquivo: Arquivo = {
              id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              nome: file.name,
              tamanho: file.size,
              tipo: file.type || 'application/octet-stream',
              url: reader.result as string,
              criadoEm: new Date().toISOString(),
              usuarioId: '1'
            }
            
            setArquivos(prev => [novoArquivo, ...prev])
            setUploads(prev => prev.map(u => 
              u.id === uploadId 
                ? { ...u, progresso: 100, status: 'completed' as const }
                : u
            ))
            
            // Remover da lista de uploads após 2 segundos
            setTimeout(() => {
              setUploads(prev => prev.filter(u => u.id !== uploadId))
            }, 2000)
          }
          reader.readAsDataURL(file)
        } else {
          setUploads(prev => prev.map(u => 
            u.id === uploadId ? { ...u, progresso: Math.min(progress, 95) } : u
          ))
        }
      }, 200)
    })
  }

  const deleteFile = (id: string) => {
    setArquivos(prev => prev.filter(a => a.id !== id))
  }

  const downloadFile = (arquivo: Arquivo) => {
    const link = document.createElement('a')
    link.href = arquivo.url
    link.download = arquivo.nome
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <FilesContext.Provider value={{ arquivos, uploads, isLoading, uploadFiles, deleteFile, downloadFile }}>
      {children}
    </FilesContext.Provider>
  )
}
