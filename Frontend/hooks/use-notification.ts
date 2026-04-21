/**
 * useNotification Hook
 * Provides a clean interface for showing notifications
 * Follows the Dependency Injection pattern
 */

import { toast } from "sonner";
import type { NotificationPayload } from "@/lib/notification-service";

export function useNotification() {
  /**
   * Show a notification
   * @param notification - NotificationPayload with type, title, and description
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
