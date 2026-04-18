import { useState } from 'react'
import { 
  MoreVertical, 
  Download, 
  Trash2, 
  Image, 
  Video, 
  Music, 
  FileText, 
  Archive, 
  File 
} from 'lucide-react'
import type { Arquivo } from '../../types'
import { formatBytes, formatDate, getFileType, getFileExtension, cn } from '../../utils'
import { useFiles } from '../../contexts/FilesContext'

interface FileCardProps {
  arquivo: Arquivo
}

export function FileCard({ arquivo }: FileCardProps) {
  const { deleteFile, downloadFile } = useFiles()
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fileType = getFileType(arquivo.tipo)
  const extension = getFileExtension(arquivo.nome)

  const icons = {
    image: Image,
    video: Video,
    audio: Music,
    document: FileText,
    archive: Archive,
    other: File
  }

  const colors = {
    image: 'text-pink-400 bg-pink-400/10',
    video: 'text-purple-400 bg-purple-400/10',
    audio: 'text-green-400 bg-green-400/10',
    document: 'text-blue-400 bg-blue-400/10',
    archive: 'text-yellow-400 bg-yellow-400/10',
    other: 'text-gray-400 bg-gray-400/10'
  }

  const Icon = icons[fileType]

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      deleteFile(arquivo.id)
    }, 200)
  }

  const isImage = fileType === 'image'

  return (
    <div 
      className={cn(
        'group relative bg-surface border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5',
        isDeleting && 'opacity-50 scale-95'
      )}
    >
      {/* Preview area */}
      <div className="aspect-square relative bg-surface-hover flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img 
            src={arquivo.url} 
            alt={arquivo.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={cn('p-4 rounded-xl', colors[fileType])}>
            <Icon size={48} />
          </div>
        )}
        
        {/* Extension badge */}
        {extension && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-background/80 backdrop-blur-sm text-xs font-mono font-medium text-foreground rounded">
            {extension}
          </span>
        )}

        {/* Menu button */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
            aria-label="Opções do arquivo"
          >
            <MoreVertical size={16} className="text-foreground" />
          </button>
          
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)} 
              />
              <div className="absolute right-0 top-full mt-1 w-40 bg-surface border border-border rounded-lg shadow-xl z-20 overflow-hidden">
                <button
                  onClick={() => {
                    downloadFile(arquivo)
                    setShowMenu(false)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-surface-hover transition-colors"
                >
                  <Download size={14} />
                  Baixar
                </button>
                <button
                  onClick={() => {
                    handleDelete()
                    setShowMenu(false)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                >
                  <Trash2 size={14} />
                  Excluir
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* File info */}
      <div className="p-3">
        <p className="text-sm font-medium text-foreground truncate" title={arquivo.nome}>
          {arquivo.nome}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted">{formatBytes(arquivo.tamanho)}</span>
          <span className="text-xs text-muted">{formatDate(arquivo.criadoEm)}</span>
        </div>
      </div>
    </div>
  )
}
