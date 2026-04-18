import { useState } from 'react'
import { User, Mail, Lock, Trash2, AlertTriangle } from 'lucide-react'
import { DashboardLayout } from '../components/layouts/DashboardLayout'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'

export function SettingsPage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || ''
  })

  const handleSave = () => {
    // Simulação - em produção, chamaria API
    setIsEditing(false)
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-8">Configurações</h1>

        {/* Profile Section */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
            <User size={20} className="text-primary" />
            Perfil
          </h2>
          
          <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <User size={28} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{user?.nome}</p>
                <p className="text-sm text-muted">{user?.email}</p>
              </div>
            </div>

            {isEditing ? (
              <>
                <Input
                  label="Nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                />
                <Input
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleSave}>Salvar</Button>
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancelar</Button>
                </div>
              </>
            ) : (
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                Editar perfil
              </Button>
            )}
          </div>
        </section>

        {/* Security Section */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
            <Lock size={20} className="text-primary" />
            Segurança
          </h2>
          
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Senha</p>
                <p className="text-sm text-muted">Última alteração: nunca</p>
              </div>
              <Button variant="secondary">Alterar senha</Button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="text-lg font-medium text-error mb-4 flex items-center gap-2">
            <AlertTriangle size={20} />
            Zona de perigo
          </h2>
          
          <div className="bg-error/5 border border-error/20 rounded-xl p-6">
            {showDeleteConfirm ? (
              <div>
                <p className="font-medium text-foreground mb-2">Tem certeza?</p>
                <p className="text-sm text-muted mb-4">
                  Esta ação é irreversível. Todos os seus arquivos serão excluídos permanentemente.
                </p>
                <div className="flex gap-3">
                  <Button variant="danger">
                    <Trash2 size={16} />
                    Confirmar exclusão
                  </Button>
                  <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Excluir conta</p>
                  <p className="text-sm text-muted">Exclua sua conta e todos os seus dados</p>
                </div>
                <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 size={16} />
                  Excluir conta
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
