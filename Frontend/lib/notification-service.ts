/**
 * Notification Service
 * Centralizes all notification types and messages following SOLID principles
 */

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  description: string;
  duration?: number;
}

/**
 * Pre-defined notification templates for common actions
 * This follows the Single Responsibility Principle by centralizing all messages
 */
export const NotificationTemplates = {
  // Auth notifications
  auth: {
    loginSuccess: (username: string): NotificationPayload => ({
      type: "success",
      title: "Bem-vindo!",
      description: `Você entrou como ${username}`,
      duration: 3000,
    }),
    registerSuccess: (username: string): NotificationPayload => ({
      type: "success",
      title: "Conta criada!",
      description: `${username}, sua conta foi criada com sucesso`,
      duration: 3000,
    }),
    logoutSuccess: (): NotificationPayload => ({
      type: "info",
      title: "Até logo!",
      description: "Você foi desconectado",
      duration: 2000,
    }),
    loginError: (error: string): NotificationPayload => ({
      type: "error",
      title: "Erro ao fazer login",
      description: error || "Verifique suas credenciais",
      duration: 4000,
    }),
    registerError: (error: string): NotificationPayload => ({
      type: "error",
      title: "Erro ao criar conta",
      description: error || "Tente novamente",
      duration: 4000,
    }),
  },

  // Upload notifications
  upload: {
    uploadStart: (fileName: string): NotificationPayload => ({
      type: "info",
      title: "Upload iniciado",
      description: `Enviando ${fileName}...`,
      duration: 2000,
    }),
    uploadSuccess: (fileName: string): NotificationPayload => ({
      type: "success",
      title: "Upload concluído!",
      description: `${fileName} foi enviado com sucesso`,
      duration: 3000,
    }),
    uploadError: (fileName: string, error: string): NotificationPayload => ({
      type: "error",
      title: "Erro no upload",
      description: `${fileName}: ${error}`,
      duration: 4000,
    }),
    uploadProgress: (
      fileName: string,
      percent: number,
    ): NotificationPayload => ({
      type: "info",
      title: "Upload em progresso",
      description: `${fileName} - ${percent}%`,
      duration: 1000,
    }),
  },

  // File notifications
  file: {
    deleteSuccess: (fileName: string): NotificationPayload => ({
      type: "success",
      title: "Arquivo deletado",
      description: `${fileName} foi removido`,
      duration: 3000,
    }),
    deleteError: (fileName: string): NotificationPayload => ({
      type: "error",
      title: "Erro ao deletar",
      description: `Não foi possível remover ${fileName}`,
      duration: 3000,
    }),
  },

  // Settings notifications
  settings: {
    updateSuccess: (field: string): NotificationPayload => ({
      type: "success",
      title: "Atualizado com sucesso!",
      description: `Suas ${field} foram atualizadas`,
      duration: 3000,
    }),
    updateError: (field: string): NotificationPayload => ({
      type: "error",
      title: "Erro ao atualizar",
      description: `Não foi possível atualizar ${field}`,
      duration: 3000,
    }),
    deleteAccountSuccess: (): NotificationPayload => ({
      type: "warning",
      title: "Conta deletada",
      description: "Sua conta foi removida",
      duration: 2000,
    }),
  },
} as const;
