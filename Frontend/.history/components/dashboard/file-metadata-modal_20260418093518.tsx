import { formatFileSize, formatDuration } from "@/lib/mock-data";
import type { MediaFile } from "@/lib/types";
import { FileStatusBadge } from "./file-status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Copy,
  Globe,
  Clock,
  HardDrive,
  FileType,
  Monitor,
  Film,
  Palette,
} from "lucide-react";

interface FileMetadataModalProps {
  file: MediaFile | null;
  open: boolean;
  onClose: () => void;
}

export function FileMetadataModal({ file, open, onClose }: FileMetadataModalProps) {
  if (!file) return null;

  const metadataItems = [
    { icon: HardDrive, label: "Tamanho", value: formatFileSize(file.size) },
    { icon: FileType, label: "Tipo", value: file.type },
    ...(file.metadata?.duration
      ? [{ icon: Clock, label: "Duração", value: formatDuration(file.metadata.duration) }]
      : []),
    ...(file.metadata?.width && file.metadata?.height
      ? [
          {
            icon: Monitor,
            label: "Resolução",
            value: `${file.metadata.width}×${file.metadata.height}`,
          },
        ]
      : []),
    ...(file.metadata?.codec
      ? [{ icon: Film, label: "Codec", value: file.metadata.codec }]
      : []),
    ...(file.metadata?.bitrate
      ? [
          {
            icon: Film,
            label: "Bitrate",
            value: `${(file.metadata.bitrate / 1_000_000).toFixed(1)} Mbps`,
          },
        ]
      : []),
    ...(file.metadata?.frameRate
      ? [{ icon: Film, label: "Frame Rate", value: `${file.metadata.frameRate} fps` }]
      : []),
    ...(file.metadata?.colorSpace
      ? [{ icon: Palette, label: "Color Space", value: file.metadata.colorSpace }]
      : []),
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass sm:max-w-lg border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-3">
            <span className="truncate">{file.name}</span>
            <FileStatusBadge status={file.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Edge location banner */}
          {file.edgeLocation && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Distribuição via Edge
                </p>
                <p className="text-xs text-muted-foreground">
                  Servido de {file.edgeLocation} via CloudFront
                </p>
              </div>
            </div>
          )}

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-4">
            {metadataItems.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </div>
                <p className="text-sm font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Timestamps */}
          <Separator className="bg-border" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Upload</p>
              <p className="text-foreground">
                {file.uploadedAt.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {file.processedAt && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Processado</p>
                <p className="text-foreground">
                  {file.processedAt.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Error message */}
          {file.errorMessage && (
            <>
              <Separator className="bg-border" />
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{file.errorMessage}</p>
              </div>
            </>
          )}

          {/* Actions */}
          {file.status === "processed" && file.downloadUrl && (
            <>
              <Separator className="bg-border" />
              <div className="flex gap-3">
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Download className="h-4 w-4 mr-2" />
                  Download via CDN
                </Button>
                <Button
                  variant="outline"
                  className="border-border hover:border-primary"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
