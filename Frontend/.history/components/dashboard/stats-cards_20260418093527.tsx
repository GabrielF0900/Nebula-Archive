import type { MediaFile } from "@/lib/types";
import { formatFileSize } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  HardDrive,
  FileCheck,
  Clock,
  AlertTriangle,
  Globe,
  Zap,
} from "lucide-react";

interface StatsCardsProps {
  files: MediaFile[];
}

export function StatsCards({ files }: StatsCardsProps) {
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const processedCount = files.filter((f) => f.status === "processed").length;
  const pendingCount = files.filter(
    (f) => f.status === "pending" || f.status === "processing"
  ).length;
  const errorCount = files.filter((f) => f.status === "error").length;

  const stats = [
    {
      label: "Armazenamento Total",
      value: formatFileSize(totalSize),
      icon: HardDrive,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Processados",
      value: processedCount.toString(),
      icon: FileCheck,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Em Processamento",
      value: pendingCount.toString(),
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Erros",
      value: errorCount.toString(),
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="glass-light rounded-lg p-4 border border-border"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  stat.bgColor
                )}
              >
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </div>
            <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Edge distribution banner */}
      <div className="glass-light rounded-lg p-5 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-foreground mb-1">
              Distribuição Global Ativa
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Seus arquivos processados estão sendo servidos via CloudFront em 6 Edge
              Locations para máxima performance.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-success" />
                <span className="text-muted-foreground">Latência média:</span>
                <span className="text-success font-medium">12ms</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="h-3 w-3 text-primary" />
                <span className="text-muted-foreground">Regiões:</span>
                <span className="text-primary font-medium">6 ativas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
