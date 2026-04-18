import { Check, AlertCircle, Loader2, File } from 'lucide-react'
import type { UploadProgress as UploadProgressType } from '../../types'
import { cn } from '../../utils'

interface UploadProgressProps {
  uploads: UploadProgressType[]
}

export function UploadProgress({ uploads }: UploadProgressProps) {
  if (uploads.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">
        Enviando {uploads.length} {uploads.length === 1 ? 'arquivo' : 'arquivos'}
      </h3>
      
      <div className="space-y-2">
        {uploads.map((upload) => (
          <div 
            key={upload.id}
            className="bg-surface border border-border rounded-lg p-3"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                upload.status === 'completed' && 'bg-success/10',
                upload.status === 'error' && 'bg-error/10',
                upload.status === 'uploading' && 'bg-primary/10'
              )}>
                {upload.status === 'uploading' && (
                  <Loader2 size={20} className="text-primary animate-spin" />
                )}
                {upload.status === 'completed' && (
                  <Check size={20} className="text-success" />
                )}
                {upload.status === 'error' && (
                  <AlertCircle size={20} className="text-error" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground truncate pr-2">
                    {upload.nome}
                  </p>
                  <span className="text-xs text-muted flex-shrink-0">
                    {upload.status === 'uploading' && `${Math.round(upload.progresso)}%`}
                    {upload.status === 'completed' && 'Concluído'}
                    {upload.status === 'error' && 'Erro'}
                  </span>
                </div>
                
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      'h-full transition-all duration-300 rounded-full',
                      upload.status === 'completed' && 'bg-success',
                      upload.status === 'error' && 'bg-error',
                      upload.status === 'uploading' && 'bg-gradient-to-r from-primary to-accent'
                    )}
                    style={{ width: `${upload.progresso}%` }}
                  />
                </div>

                {upload.erro && (
                  <p className="text-xs text-error mt-1">{upload.erro}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
