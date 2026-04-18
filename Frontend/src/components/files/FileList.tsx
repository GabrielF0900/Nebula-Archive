import { FolderOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Arquivo } from '../../types'
import { FileCard } from './FileCard'
import { Button } from '../ui/Button'

interface FileListProps {
  arquivos: Arquivo[]
  isLoading?: boolean
}

export function FileList({ arquivos, isLoading }: FileListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-surface rounded-xl" />
            <div className="mt-3 h-4 bg-surface rounded w-3/4" />
            <div className="mt-2 h-3 bg-surface rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (arquivos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-4">
          <FolderOpen size={40} className="text-muted" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          Nenhum arquivo ainda
        </h3>
        <p className="text-muted mb-6 max-w-sm">
          Comece enviando seus primeiros arquivos para armazená-los com segurança na nuvem.
        </p>
        <Link to="/dashboard/upload">
          <Button>
            Enviar arquivos
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {arquivos.map((arquivo) => (
        <FileCard key={arquivo.id} arquivo={arquivo} />
      ))}
    </div>
  )
}
