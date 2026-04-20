import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Mail, Calendar, Shield, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <div className="text-center py-12">Carregando perfil...</div>;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const initials = user.username?.slice(0, 2).toUpperCase() || "U";

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="glass-light rounded-lg p-8 border border-border">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24 border-2 border-primary/20">
            <AvatarFallback className="text-lg font-semibold bg-primary/10">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">
              {user.username}
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {user.email}
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              Membro desde {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Information */}
        <Card className="glass-light border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Informações da Conta
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Nome de Usuário
              </label>
              <p className="text-foreground mt-1">{user.username}</p>
            </div>

            <div className="border-t border-border pt-4">
              <label className="text-xs font-medium text-muted-foreground">
                Email
              </label>
              <p className="text-foreground mt-1">{user.email}</p>
            </div>

            <div className="border-t border-border pt-4">
              <label className="text-xs font-medium text-muted-foreground">
                ID da Conta
              </label>
              <p className="text-foreground mt-1 font-mono text-sm">
                {user.id}
              </p>
            </div>
          </div>
        </Card>

        {/* Account Statistics */}
        <Card className="glass-light border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Estatísticas
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Data de Registro
              </label>
              <p className="text-foreground mt-1">
                {formatDate(user.createdAt)}
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <label className="text-xs font-medium text-muted-foreground">
                Status da Conta
              </label>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <p className="text-foreground">Ativo</p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <label className="text-xs font-medium text-muted-foreground">
                Plano
              </label>
              <p className="text-foreground mt-1">Gratuito</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Security Information */}
      <Card className="glass-light border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Segurança</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-sm text-foreground font-medium mb-1">
              Autenticação
            </p>
            <p className="text-xs text-muted-foreground">
              Sua conta usa autenticação por email e senha. Você pode alterar
              sua senha nas configurações.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-success/5 border border-success/20">
            <p className="text-sm text-foreground font-medium mb-1">
              ✓ Conta Segura
            </p>
            <p className="text-xs text-muted-foreground">
              Nenhuma atividade suspeita detectada em sua conta.
            </p>
          </div>
        </div>
      </Card>

      {/* Session Information */}
      <Card className="glass-light border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Sessão Atual
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">
                Navegador Atual
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {typeof navigator !== "undefined"
                  ? navigator.userAgent.split(" ").slice(-1)[0]
                  : "Desconhecido"}
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>
        </div>
      </Card>
    </div>
  );
}
