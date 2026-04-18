import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Grid3X3, List, SlidersHorizontal } from 'lucide-react'
import { DashboardLayout } from '../components/layouts/DashboardLayout'
import { FileList } from '../components/files/FileList'
import { Button } from '../components/ui/Button'
import { useFiles } from '../contexts/FilesContext'
import { cn, getFileType } from '../utils'
import type { FileType } from '../types'

type ViewMode = 'grid' | 'list'
type SortBy = 'data' | 'nome' | 'tamanho'

export function DashboardPage() {
  const { arquivos, isLoading } = useFiles()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<FileType | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortBy>('data')

  const filteredArquivos = useMemo(() => {
    let result = [...arquivos]

    // Filtrar por busca
    if (searchQuery) {
      result = result.filter(a => 
        a.nome.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtrar por tipo
    if (filterType !== 'all') {
      result = result.filter(a => getFileType(a.tipo) === filterType)
    }

    // Ordenar
    result.sort((a, b) => {
      switch (sortBy) {
        case 'nome':
          return a.nome.localeCompare(b.nome)
        case 'tamanho':
          return b.tamanho - a.tamanho
        case 'data':
        default:
          return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
      }
    })

    return result
  }, [arquivos, searchQuery, filterType, sortBy])

  const filterOptions: { value: FileType | 'all'; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'image', label: 'Imagens' },
    { value: 'video', label: 'Vídeos' },
    { value: 'audio', label: 'Áudio' },
    { value: 'document', label: 'Documentos' },
    { value: 'archive', label: 'Arquivos' },
  ]

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meus Arquivos</h1>
            <p className="text-muted text-sm mt-1">
              {arquivos.length} {arquivos.length === 1 ? 'arquivo' : 'arquivos'} armazenados
            </p>
          </div>
          <Link to="/dashboard/upload">
            <Button>
              <Plus size={18} />
              Enviar arquivos
            </Button>
          </Link>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Buscar arquivos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter by type */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterType(option.value)}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-lg whitespace-nowrap transition-colors',
                    filterType === option.value
                      ? 'bg-primary text-white'
                      : 'bg-surface text-muted hover:text-foreground hover:bg-surface-hover'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative group">
              <button className="p-2.5 bg-surface border border-border rounded-lg text-muted hover:text-foreground transition-colors">
                <SlidersHorizontal size={18} />
              </button>
              <div className="absolute right-0 top-full mt-2 w-40 bg-surface border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <div className="p-2">
                  <p className="text-xs text-muted px-2 py-1">Ordenar por</p>
                  {(['data', 'nome', 'tamanho'] as SortBy[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => setSortBy(option)}
                      className={cn(
                        'w-full text-left px-2 py-1.5 text-sm rounded transition-colors',
                        sortBy === option ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-surface-hover'
                      )}
                    >
                      {option === 'data' && 'Data'}
                      {option === 'nome' && 'Nome'}
                      {option === 'tamanho' && 'Tamanho'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* View mode toggle */}
            <div className="flex bg-surface border border-border rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted hover:text-foreground'
                )}
                aria-label="Visualização em grade"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'list' ? 'bg-primary text-white' : 'text-muted hover:text-foreground'
                )}
                aria-label="Visualização em lista"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* File list */}
        <FileList arquivos={filteredArquivos} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  )
}
