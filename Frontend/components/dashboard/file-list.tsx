import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useNotification } from "@/hooks/use-notification";
import { NotificationTemplates } from "@/lib/notification-service";
import type { FileResponse } from "@/lib/api";
import { getDownloadUrl } from "@/lib/api";
import { FileStatusBadge } from "./file-status-badge";
import { FileMetadataModal } from "./file-metadata-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  Zap,
  Folder as FolderIcon,
} from "lucide-react";
import JSZip from "jszip";

interface FileListProps {
  files: FileResponse[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onDelete?: (fileId: string) => Promise<void>;
  token?: string;
}

const ITEMS_PER_PAGE = 10;

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("pt-BR");
}

function getFileIcon(type: string, isFolder?: boolean) {
  if (isFolder) return FolderIcon;
  if (type.startsWith("video/")) return FileVideo;
  if (type.startsWith("audio/")) return FileAudio;
  if (type.includes("zip") || type.includes("archive")) return FileArchive;
  if (type.includes("document") || type.includes("presentation"))
    return FileText;
  return File;
}

export function FileList({
  files,
  onRefresh,
  isRefreshing,
  onDelete,
  token,
}: FileListProps) {
  const { notify } = useNotification();
  const [selectedFile, setSelectedFile] = useState<FileResponse | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(
    new Set(),
  );
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);

  // Filtrar apenas arquivos de nível superior (sem folderPath ou isFolder)
  const topLevelFiles = files.filter(
    (file) => !file.folderPath || file.isFolder,
  );

  // Calcular paginação
  const totalPages = Math.ceil(topLevelFiles.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedFiles = topLevelFiles.slice(startIdx, endIdx);

  // Alternar seleção de arquivo
  const toggleFileSelection = (fileId: string) => {
    const newSelected = new Set(selectedFileIds);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFileIds(newSelected);
  };

  // Selecionar/desselecionar todos os arquivos da página
  const toggleAllOnPage = () => {
    const pageFileIds = new Set(paginatedFiles.map((f) => f.id));
    if (selectedFileIds.size === paginatedFiles.length) {
      // Desselecionar todos da página
      const newSelected = new Set(selectedFileIds);
      pageFileIds.forEach((id) => newSelected.delete(id));
      setSelectedFileIds(newSelected);
    } else {
      // Selecionar todos da página
      const newSelected = new Set(selectedFileIds);
      pageFileIds.forEach((id) => newSelected.add(id));
      setSelectedFileIds(newSelected);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!onDelete) return;
    try {
      setDeletingFileId(fileId);
      await onDelete(fileId);
    } finally {
      setDeletingFileId(null);
    }
  };

  // Deletar múltiplos arquivos
  const handleDeleteBatch = async () => {
    if (selectedFileIds.size === 0 || !onDelete) return;

    const confirm = window.confirm(
      `Tem certeza que deseja deletar ${selectedFileIds.size} arquivo(s)?`,
    );
    if (!confirm) return;

    setIsDeletingBatch(true);
    let deleted = 0;
    let failed = 0;

    for (const fileId of selectedFileIds) {
      try {
        await onDelete(fileId);
        deleted++;
      } catch (error) {
        failed++;
      }
    }

    setSelectedFileIds(new Set());
    setIsDeletingBatch(false);

    if (failed === 0) {
      notify({
        type: "success",
        title: "Sucesso!",
        description: `${deleted} arquivo(s) deletado(s)`,
        duration: 3000,
      });
    } else {
      notify({
        type: "warning",
        title: "Parcialmente concluído",
        description: `${deleted} deletado(s), ${failed} erro(s)`,
        duration: 4000,
      });
    }
  };

  const handleDownload = async (file: FileResponse) => {
    try {
      setDownloadingFileId(file.id);

      const response = await fetch(`/api/files/${file.id}/download-url`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Erro ao obter URL de download: ${response.statusText}`,
        );
      }

      const data = await response.json();
      const downloadUrl = data.downloadUrl;

      if (!downloadUrl) {
        throw new Error("URL de download não recebida do servidor");
      }

      const fileResponse = await fetch(downloadUrl);
      if (!fileResponse.ok) {
        throw new Error(`Erro ao baixar arquivo: ${fileResponse.statusText}`);
      }

      const blob = await fileResponse.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Erro ao fazer download:", error);
      notify({
        type: "error",
        title: "Erro no download",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        duration: 4000,
      });
    } finally {
      setDownloadingFileId(null);
    }
  };

  // Download múltiplos arquivos como ZIP
  const handleDownloadBatch = async () => {
    if (selectedFileIds.size === 0) return;

    setIsDownloadingZip(true);
    const zip = new JSZip();
    let downloaded = 0;
    let failed = 0;

    try {
      notify({
        type: "info",
        title: "Preparando ZIP",
        description: `Baixando ${selectedFileIds.size} arquivo(s)...`,
        duration: 2000,
      });

      for (const fileId of selectedFileIds) {
        const file = files.find((f) => f.id === fileId);
        if (!file) continue;

        try {
          const response = await fetch(`/api/files/${fileId}/download-url`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          });

          if (!response.ok) throw new Error("Erro ao obter URL");

          const data = await response.json();
          const fileResponse = await fetch(data.downloadUrl);

          if (!fileResponse.ok) throw new Error("Erro ao baixar arquivo");

          const blob = await fileResponse.blob();
          zip.file(file.name, blob);
          downloaded++;
        } catch (error) {
          console.error(`Erro ao baixar ${file.name}:`, error);
          failed++;
        }
      }

      if (downloaded === 0) {
        throw new Error("Nenhum arquivo foi baixado");
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const blobUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `arquivos-${new Date().getTime()}.zip`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);

      setSelectedFileIds(new Set());

      if (failed === 0) {
        notify({
          type: "success",
          title: "ZIP criado!",
          description: `${downloaded} arquivo(s) empacotado(s)`,
          duration: 3000,
        });
      } else {
        notify({
          type: "warning",
          title: "ZIP parcial",
          description: `${downloaded} arquivo(s) baixado(s), ${failed} erro(s)`,
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Erro ao criar ZIP:", error);
      notify({
        type: "error",
        title: "Erro ao criar ZIP",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        duration: 4000,
      });
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Seus arquivos
            </h2>
            <p className="text-sm text-muted-foreground">
              {files.length} arquivo{files.length !== 1 && "s"} •{" "}
              {selectedFileIds.size > 0 && (
                <span className="text-primary font-medium">
                  {selectedFileIds.size} selecionado(s)
                </span>
              )}
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

        {/* Ações em lote */}
        {selectedFileIds.size > 0 && (
          <div className="flex gap-2 p-3 rounded-lg bg-muted/50 border border-border">
            <Button
              variant="default"
              size="sm"
              onClick={handleDownloadBatch}
              disabled={isDownloadingZip}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloadingZip
                ? "Preparando ZIP..."
                : `Baixar ${selectedFileIds.size} em ZIP`}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteBatch}
              disabled={isDeletingBatch}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeletingBatch
                ? "Deletando..."
                : `Deletar ${selectedFileIds.size}`}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedFileIds(new Set())}
            >
              Cancelar
            </Button>
          </div>
        )}

        {/* File grid */}
        <div className="space-y-3">
          {/* Checkbox header (selecionar tudo) */}
          {paginatedFiles.length > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
              <Checkbox
                checked={
                  paginatedFiles.length > 0 &&
                  selectedFileIds.size === paginatedFiles.length
                }
                onCheckedChange={toggleAllOnPage}
              />
              <span className="text-sm text-muted-foreground">
                Selecionar todos ({paginatedFiles.length})
              </span>
            </div>
          )}

          {/* Arquivos */}
          {paginatedFiles.map((file) => {
            const Icon = getFileIcon(file.type, file.isFolder);
            const isSelected = selectedFileIds.has(file.id);
            return (
              <div
                key={file.id}
                className={cn(
                  "group glass-light rounded-lg p-4 transition-all",
                  "border transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:border-border hover:bg-muted/30",
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleFileSelection(file.id)}
                    className="mt-1"
                  />

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
                      {file.metadata?.width && file.metadata?.height && (
                        <span>
                          {file.metadata.width}×{file.metadata.height}
                        </span>
                      )}
                      <span>{formatDate(file.uploadedAt)}</span>
                    </div>
                    {file.edgeLocation && (
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-primary">
                        <Zap className="h-3 w-3" />
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
                    {file.status === "processed" && (
                      <Button
                        onClick={() => handleDownload(file)}
                        disabled={downloadingFileId === file.id}
                        variant="outline"
                        size="sm"
                        className="h-8 border-border hover:border-primary"
                      >
                        <Download className="h-4 w-4 mr-1.5" />
                        {downloadingFileId === file.id
                          ? "Baixando..."
                          : "Download"}
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
                        <DropdownMenuItem
                          onClick={() => handleDelete(file.id)}
                          disabled={deletingFileId === file.id}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deletingFileId === file.id
                            ? "Excluindo..."
                            : "Excluir"}
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

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ← Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ),
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima →
            </Button>
            <span className="text-sm text-muted-foreground ml-2">
              Página {currentPage} de {totalPages}
            </span>
          </div>
        )}
      </div>

      {/* Metadata modal */}
      <FileMetadataModal
        file={
          selectedFile
            ? ({
                ...selectedFile,
                uploadedAt: new Date(selectedFile.uploadedAt),
                processedAt: selectedFile.processedAt
                  ? new Date(selectedFile.processedAt)
                  : undefined,
              } as any)
            : null
        }
        open={!!selectedFile}
        onClose={() => setSelectedFile(null)}
      />
    </>
  );
}
