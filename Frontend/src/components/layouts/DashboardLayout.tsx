import { type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  FolderOpen, 
  Upload, 
  Settings, 
  LogOut, 
  HardDrive,
  User
} from 'lucide-react'
import { Logo } from '../ui/Logo'
import { Button } from '../ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import { useFiles } from '../../contexts/FilesContext'
import { formatBytes, cn } from '../../utils'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { arquivos } = useFiles()

  const totalUsado = arquivos.reduce((acc, arq) => acc + arq.tamanho, 0)
  const limiteTotal = 10 * 1024 * 1024 * 1024 // 10GB
  const porcentagemUsada = (totalUsado / limiteTotal) * 100

  const navItems = [
    { icon: FolderOpen, label: 'Meus Arquivos', path: '/dashboard' },
    { icon: Upload, label: 'Upload', path: '/dashboard/upload' },
    { icon: Settings, label: 'Configurações', path: '/dashboard/configuracoes' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col">
        <div className="p-6">
          <Logo size="sm" />
        </div>

        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted hover:text-foreground hover:bg-surface-hover'
                    )}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Storage indicator */}
        <div className="p-4 mx-3 mb-3 bg-surface-hover rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive size={16} className="text-muted" />
            <span className="text-sm font-medium text-foreground">Armazenamento</span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${Math.min(porcentagemUsada, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted">
            {formatBytes(totalUsado)} de {formatBytes(limiteTotal)} usados
          </p>
        </div>

        {/* User section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.nome}</p>
              <p className="text-xs text-muted truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
            <LogOut size={16} />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
