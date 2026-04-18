import { Link } from 'react-router-dom'
import { ArrowLeft, FolderOpen } from 'lucide-react'
import { DashboardLayout } from '../components/layouts/DashboardLayout'
import { DropZone } from '../components/upload/DropZone'
import { UploadProgress } from '../components/upload/UploadProgress'
import { Button } from '../components/ui/Button'
import { useFiles } from '../contexts/FilesContext'

export function UploadPage() {
  const { uploadFiles, uploads, arquivos } = useFiles()

  const recentFiles = arquivos.slice(0, 5)

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Voltar aos arquivos
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Enviar arquivos</h1>
          <p className="text-muted text-sm mt-1">
            Arraste e solte ou selecione arquivos do seu computador
          </p>
        </div>

        {/* Drop zone */}
        <div className="mb-8">
          <DropZone onFilesSelected={uploadFiles} />
        </div>

        {/* Upload progress */}
        {uploads.length > 0 && (
          <div className="mb-8">
            <UploadProgress uploads={uploads} />
          </div>
        )}

        {/* Recent uploads */}
        {recentFiles.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-foreground">Arquivos recentes</h2>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
            
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              {recentFiles.map((arquivo, index) => (
                <div 
                  key={arquivo.id}
                  className={`flex items-center gap-3 p-4 ${
                    index !== recentFiles.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-surface-hover rounded-lg flex items-center justify-center">
                    <FolderOpen size={18} className="text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {arquivo.nome}
                    </p>
                    <p className="text-xs text-muted">
                      Enviado agora
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-4 bg-surface border border-border rounded-xl">
          <h3 className="text-sm font-medium text-foreground mb-2">Dicas de upload</h3>
          <ul className="text-sm text-muted space-y-1">
            <li>- Você pode arrastar múltiplos arquivos de uma vez</li>
            <li>- Tamanho máximo por arquivo: 100MB</li>
            <li>- Formatos suportados: imagens, vídeos, documentos, áudio e mais</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
