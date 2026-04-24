/**
 * Hook para gerenciar notificações no sistema
 * Implementa padrão de Injeção de Dependência
 */

import { toast } from "sonner";
import type { NotificationPayload } from "@/lib/notification-service";

export function useNotification() {
  /**
   * Exibe uma notificação na tela
   * @param notification - NotificationPayload com tipo, título e descrição
   */
  const notify = (notification: NotificationPayload) => {
    const message = notification.description || notification.title;

    switch (notification.type) {
      case "success":
        toast.success(notification.title, {
          description: notification.description,
          duration: notification.duration,
        });
        break;
      case "error":
        toast.error(notification.title, {
          description: notification.description,
          duration: notification.duration,
        });
        break;
      case "warning":
        toast.warning(notification.title, {
          description: notification.description,
          duration: notification.duration,
        });
        break;
      case "info":
      default:
        toast.info(notification.title, {
          description: notification.description,
          duration: notification.duration,
        });
    }
  };

  return { notify };
}
