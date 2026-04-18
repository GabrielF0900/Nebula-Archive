import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { Upload, CloudUpload, File } from 'lucide-react'
import { cn, formatBytes } from '../../utils'
import { Button } from '../ui/Button'

interface DropZoneProps {
  onFilesSelected: (files: FileList) => void
  maxSizeBytes?: number
  acceptedTypes?: string
}

export function DropZone({ 
  onFilesSelected, 
  maxSizeBytes = 100 * 1024 * 1024, // 100MB default
  acceptedTypes = '*/*'
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedFiles, setDraggedFiles] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    
    if (e.dataTransfer.items) {
      const names: string[] = []
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === 'file') {
          names.push(`Arquivo ${i + 1}`)
        }
      }
      setDraggedFiles(names)
    }
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDraggedFiles([])
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDraggedFiles([])

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files)
      e.target.value = ''
    }
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        'relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer',
        isDragging 
          ? 'border-primary bg-primary/5 scale-[1.02]' 
          : 'border-border hover:border-primary/50 hover:bg-surface-hover'
      )}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      aria-label="Área de upload de arquivos"
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={acceptedTypes}
        onChange={handleFileInput}
        className="sr-only"
        aria-hidden="true"
      />

      <div className="flex flex-col items-center text-center">
        <div className={cn(
          'w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300',
          isDragging ? 'bg-primary/20' : 'bg-surface'
        )}>
          {isDragging ? (
            <CloudUpload size={40} className="text-primary animate-bounce" />
          ) : (
            <Upload size={40} className="text-muted" />
          )}
        </div>

        {isDragging ? (
          <>
            <p className="text-lg font-medium text-primary mb-2">
              Solte para enviar
            </p>
            {draggedFiles.length > 0 && (
              <p className="text-sm text-muted">
                {draggedFiles.length} {draggedFiles.length === 1 ? 'arquivo' : 'arquivos'}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-lg font-medium text-foreground mb-2">
              Arraste arquivos aqui
            </p>
            <p className="text-muted mb-6">
              ou clique para selecionar do seu computador
            </p>
            <Button variant="secondary">
              <File size={16} />
              Selecionar arquivos
            </Button>
            <p className="text-xs text-muted mt-4">
              Tamanho máximo por arquivo: {formatBytes(maxSizeBytes)}
            </p>
          </>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-border rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-border rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-border rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-border rounded-br-lg" />
    </div>
  )
}
