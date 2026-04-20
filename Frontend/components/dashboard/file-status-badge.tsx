import { cn } from "@/lib/utils";
import type { FileStatus } from "@/lib/types";
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface FileStatusBadgeProps {
  status: FileStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pendente",
    icon: Clock,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  processing: {
    label: "Processando",
    icon: Loader2,
    className: "bg-primary/10 text-primary border-primary/20",
    animate: true,
  },
  processed: {
    label: "Processado",
    icon: CheckCircle,
    className: "bg-success/10 text-success border-success/20",
  },
  error: {
    label: "Erro",
    icon: AlertCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  deleted: {
    label: "Deletado",
    icon: AlertCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function FileStatusBadge({ status, className }: FileStatusBadgeProps) {
  const config = statusConfig[status];

  // Validação para evitar erro de undefined
  if (!config) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border",
          "bg-muted/50 text-muted-foreground border-muted",
          className,
        )}
      >
        Desconhecido
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border",
        config.className,
        className,
      )}
    >
      <Icon
        className={cn(
          "h-3 w-3",
          "animate" in config && config.animate && "animate-spin",
        )}
      />
      {config.label}
    </div>
  );
}
