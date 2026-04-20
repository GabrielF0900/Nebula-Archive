import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Lock, User, Trash2, AlertTriangle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const token = localStorage.getItem("access_token");

  // Update Username
  const [newUsername, setNewUsername] = useState("");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState("");

  // Update Email
  const [newEmail, setNewEmail] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // Update Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Delete Account
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Update username
  const handleUpdateUsername = useCallback(async () => {
    if (!newUsername.trim()) {
      setUsernameError("Nome de usuário não pode estar vazio");
      return;
    }

    if (newUsername.length < 3) {
      setUsernameError("Nome de usuário deve ter pelo menos 3 caracteres");
      return;
    }

    setIsUpdatingUsername(true);
    setUsernameError("");
    setUsernameSuccess("");

    try {
      const response = await fetch(`${API_URL}/users/update-username`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao atualizar nome");
      }

      setUsernameSuccess("Nome de usuário atualizado com sucesso!");
      setNewUsername("");

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setUsernameError(
        error instanceof Error ? error.message : "Erro ao atualizar nome",
      );
    } finally {
      setIsUpdatingUsername(false);
    }
  }, [newUsername, token]);

  // Handle Update Email
  const handleUpdateEmail = useCallback(async () => {
    if (!newEmail.trim()) {
      setEmailError("Email não pode estar vazio");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError("Email inválido");
      return;
    }

    setIsUpdatingEmail(true);
    setEmailError("");
    setEmailSuccess("");

    try {
      const response = await fetch(`${API_URL}/users/update-email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao atualizar email");
      }

      setEmailSuccess("Email atualizado com sucesso!");
      setNewEmail("");

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setEmailError(
        error instanceof Error ? error.message : "Erro ao atualizar email",
      );
    } finally {
      setIsUpdatingEmail(false);
    }
  }, [newEmail, token]);

  // Update password
  const handleUpdatePassword = useCallback(async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError("Senha atual é obrigatória");
      return;
    }

    if (!newPassword) {
      setPasswordError("Nova senha é obrigatória");
      return;
    }

    if (!confirmPassword) {
      setPasswordError("Confirmação de senha é obrigatória");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não correspondem");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const response = await fetch(`${API_URL}/users/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao atualizar senha");
      }

      setPasswordSuccess("Senha atualizada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Erro ao atualizar senha",
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  }, [currentPassword, newPassword, confirmPassword, token]);

  // Delete account
  const handleDeleteAccount = useCallback(async () => {
    if (deleteConfirmation !== user?.username) {
      setPasswordError(
        "Confirmação incorreta. Digite seu nome de usuário para continuar.",
      );
      return;
    }

    setIsDeletingAccount(true);
    setPasswordError("");

    try {
      const response = await fetch(`${API_URL}/users/delete-account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao deletar conta");
      }

      logout();
      navigate("/", { replace: true });
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Erro ao deletar conta",
      );
      setIsDeletingAccount(false);
    }
  }, [deleteConfirmation, user?.username, token, logout, navigate]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Settings Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie sua conta e preferências
        </p>
      </div>

      {/* Update Username */}
      <Card className="glass-light border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Trocar Nome de Usuário
          </h2>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Nome atual:{" "}
              <span className="font-semibold">{user?.username}</span>
            </label>
            <Input
              type="text"
              placeholder="Digite seu novo nome"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full"
            />
          </div>

          {usernameError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {usernameError}
            </div>
          )}

          {usernameSuccess && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-600">
              {usernameSuccess}
            </div>
          )}

          <Button
            onClick={handleUpdateUsername}
            disabled={isUpdatingUsername || !newUsername.trim()}
            className="w-full"
          >
            {isUpdatingUsername ? "Trocar Nome..." : "Trocar Nome"}
          </Button>
        </div>
      </Card>

      {/* Update Email */}
      <Card className="glass-light border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Trocar Email
          </h2>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Email atual: <span className="font-semibold">{user?.email}</span>
            </label>
            <Input
              type="email"
              placeholder="Digite seu novo email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full"
            />
          </div>

          {emailError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {emailError}
            </div>
          )}

          {emailSuccess && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-600">
              {emailSuccess}
            </div>
          )}

          <Button
            onClick={handleUpdateEmail}
            disabled={isUpdatingEmail || !newEmail.trim()}
            className="w-full"
          >
            {isUpdatingEmail ? "Trocar Email..." : "Trocar Email"}
          </Button>
        </div>
      </Card>

      {/* Update Password */}
      <Card className="glass-light border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Alterar Senha
          </h2>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Senha Atual
            </label>
            <Input
              type="password"
              placeholder="Sua senha atual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Nova Senha
            </label>
            <Input
              type="password"
              placeholder="Sua nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Confirmar Nova Senha
            </label>
            <Input
              type="password"
              placeholder="Confirme sua nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
            />
          </div>

          {passwordError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-600">
              {passwordSuccess}
            </div>
          )}

          <Button
            onClick={handleUpdatePassword}
            disabled={
              isUpdatingPassword ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword
            }
            className="w-full"
          >
            {isUpdatingPassword ? "Alterando Senha..." : "Alterar Senha"}
          </Button>
        </div>
      </Card>

      {/* Delete Account */}
      <Card className="glass-light border border-destructive/20 bg-destructive/5 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="h-5 w-5 text-destructive" />
          <h2 className="text-lg font-semibold text-foreground">
            Deletar Conta
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive mb-1">
                Ação irreversível
              </p>
              <p className="text-xs text-muted-foreground">
                Deletar sua conta removerá permanentemente todos os seus dados,
                arquivos e configurações. Esta ação não pode ser desfeita.
              </p>
            </div>
          </div>

          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="w-full"
          >
            Deletar Minha Conta
          </Button>
        </div>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Deletar conta permanentemente?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Você está prestes a deletar sua conta e todos os seus dados
                associados. Esta ação é irreversível.
              </p>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Para confirmar, digite seu nome de usuário:
                </label>
                <Input
                  placeholder={user?.username}
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="mt-2"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={
                isDeletingAccount || deleteConfirmation !== user?.username
              }
              className={cn(
                "bg-destructive hover:bg-destructive/90",
                isDeletingAccount && "opacity-50 cursor-not-allowed",
              )}
            >
              {isDeletingAccount ? "Deletando..." : "Deletar Conta"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
