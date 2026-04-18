import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatFileSize, formatDuration } from "@/lib/mock-data";
import type { MediaFile } from "@/lib/types";
import { FileStatusBadge } from "./file-status-badge";
import { FileMetadataModal } from "./file-metadata-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  MoreHorizontal,
  Eye,
  Trash2,
  Copy,
  Globe,
  FileVideo,
  FileAudio,
  FileArchive,
  FileText,
  File,
  RefreshCw,
} from "lucide-react";

interface FileListProps {
  files: MediaFile[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

function getFileIcon(type: string) {
  if (type.startsWith("video/")) return FileVideo;
  if (type.startsWith("audio/")) return FileAudio;
  if (type.includes("zip") || type.includes("archive")) return FileArchive;
  if (type.includes("document") || type.includes("presentation")) return FileText;
  return File;
}

export function FileList({ files, onRefresh, isRefreshing }: FileListProps) {
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Seus arquivos</h2>
            <p className="text-sm text-muted-foreground">
              {files.length} arquivo{files.length !== 1 && "s"} • Monitoramento via Short Polling
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="border-border"
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")}
            />
            Atualizar
          </Button>
        </div>

        {/* File grid */}
        <div className="grid gap-3">
          {files.map((file) => {
            const Icon = getFileIcon(file.type);
            return (
              <div
                key={file.id}
                className={cn(
                  "group glass-light rounded-lg p-4 transition-all hover:bg-muted/30",
                  "border border-transparent hover:border-border"
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </h3>
                      <FileStatusBadge status={file.status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      {file.metadata?.duration && (
                        <span>{formatDuration(file.metadata.duration)}</span>
                      )}
                      {file.metadata?.width && file.metadata?.height && (
                        <span>
                          {file.metadata.width}×{file.metadata.height}
                        </span>
                      )}
                      <span>
                        {file.uploadedAt.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {file.edgeLocation && (
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-primary">
                        <Globe className="h-3 w-3" />
                        <span>Edge: {file.edgeLocation}</span>
                      </div>
                    )}
                    {file.errorMessage && (
                      <p className="text-xs text-destructive mt-1">
                        {file.errorMessage}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {file.status === "processed" && file.downloadUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-border hover:border-primary hover:text-primary"
                      >
                        <Download className="h-4 w-4 mr-1.5" />
                        Download
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => setSelectedFile(file)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver metadados
                        </DropdownMenuItem>
                        {file.downloadUrl && (
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar URL CDN
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {files.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Nenhum arquivo encontrado</p>
          </div>
        )}
      </div>

      {/* Metadata modal */}
      <FileMetadataModal
        file={selectedFile}
        open={!!selectedFile}
        onClose={() => setSelectedFile(null)}
      />
    </>
  );
}
