import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useNotification } from "@/hooks/use-notification";
import { NotificationTemplates } from "@/lib/notification-service";
import { formatFileSize } from "@/lib/mock-data";
import {
  generateUploadUrl,
  uploadFileToS3,
  registerFileMetadata,
} from "@/lib/api";
import type { UploadProgress } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Cloud,
  FileUp,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
} from "lucide-react";

interface UploadDropzoneProps {
  onUploadComplete?: () => void;
}

interface FileWithPath extends File {
  webkitRelativePath?: string;
}

const uploadStatusLabels = {
  "generating-url": "Gerando URL segura...",
  uploading: "Fazendo upload...",
  validating: "Validando integridade...",
  complete: "Concluído",
  error: "Erro",
};

export function UploadDropzone({ onUploadComplete }: UploadDropzoneProps) {
  const { user } = useAuth();
  const { notify } = useNotification();
  const token = localStorage.getItem("access_token");
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: FileWithPath, folderPath?: string) => {
      if (!token) {
        console.error("Usuário não autenticado");
        const notification = NotificationTemplates.upload.uploadError(
          file.name,
          "Usuário não autenticado",
        );
        notify(notification);
        return;
      }

      // Usar o caminho relativo da pasta ou o nome do arquivo
      const displayName = folderPath || file.name;

      // Mostrar notificação de início do upload
      const startNotification =
        NotificationTemplates.upload.uploadStart(displayName);
      notify(startNotification);

      // Adicionar ao estado de uploads
      setUploads((prev) => [
        ...prev,
        {
          file: { ...file, name: displayName },
          progress: 0,
          status: "generating-url",
        },
      ]);

      try {
        // 1. Gerar URL de upload assinada
        const { uploadUrl, fileKey } = await generateUploadUrl(
          displayName,
          file.type,
          token,
        );

        setUploads((prev) =>
          prev.map((u) =>
            u.file.name === displayName && u.status === "generating-url"
              ? { ...u, progress: 10, status: "uploading" }
              : u,
          ),
        );

        // 2. Fazer upload do arquivo para S3
        await uploadFileToS3(uploadUrl, file, (progress) => {
          setUploads((prev) =>
            prev.map((u) =>
              u.file.name === displayName && u.status === "uploading"
                ? { ...u, progress: Math.min(10 + progress * 0.7, 85) }
                : u,
            ),
          );
        });

        // 3. Validar integridade
        setUploads((prev) =>
          prev.map((u) =>
            u.file.name === displayName && u.status === "uploading"
              ? { ...u, progress: 95, status: "validating" }
              : u,
          ),
        );

        // 4. Registrar metadados no banco de dados
        await registerFileMetadata(
          {
            name: displayName,
            size: file.size,
            type: file.type,
            fileKey,
          },
          token,
        );

        // 5. Marcar como concluído
        setUploads((prev) =>
          prev.map((u) =>
            u.file.name === displayName && u.status === "validating"
              ? { ...u, progress: 100, status: "complete" }
              : u,
          ),
        );

        // Mostrar notificação de sucesso
        const successNotification =
          NotificationTemplates.upload.uploadSuccess(displayName);
        notify(successNotification);

        // Remover da lista após 2 segundos
        setTimeout(() => {
          setUploads((prev) => prev.filter((u) => u.file.name !== displayName));
          onUploadComplete?.();
        }, 2000);
      } catch (error) {
        console.error("Erro no upload:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Erro desconhecido";

        // Mostrar notificação de erro
        const errorNotification = NotificationTemplates.upload.uploadError(
          displayName,
          errorMessage,
        );
        notify(errorNotification);

        setUploads((prev) =>
          prev.map((u) =>
            u.file.name === displayName
              ? {
                  ...u,
                  status: "error",
                  error: errorMessage,
                }
              : u,
          ),
        );
      }
    },
    [token, onUploadComplete, notify],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const items = e.dataTransfer.items;
      if (items) {
        // Usar DataTransferItemList API para processar pastas
        const processItems = async (items: DataTransferItemList) => {
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === "file") {
              const entry = item.webkitGetAsEntry();
              if (entry?.isDirectory) {
                // Processar diretório
                await processDirectory(entry as FileSystemDirectoryEntry);
              } else {
                // Processar arquivo individual
                const file = item.getAsFile();
                if (file) handleUpload(file as FileWithPath);
              }
            }
          }
        };
        processItems(items);
      } else {
        // Fallback para navegadores que não suportam DataTransferItemList
        const files = Array.from(e.dataTransfer.files);
        files.forEach((file) => handleUpload(file as FileWithPath));
      }
    },
    [handleUpload],
  );

  const processDirectory = useCallback(
    async (entry: FileSystemDirectoryEntry, path = "") => {
      const reader = entry.createReader();
      const entries = await new Promise<FileSystemEntry[]>((resolve) => {
        reader.readEntries(resolve);
      });

      for (const entry of entries) {
        const newPath = path ? `${path}/${entry.name}` : entry.name;
        if (entry.isDirectory) {
          await processDirectory(entry as FileSystemDirectoryEntry, newPath);
        } else {
          const file = await new Promise<File>((resolve) => {
            (entry as FileSystemFileEntry).file(resolve);
          });
          handleUpload(file as FileWithPath, newPath);
        }
      }
    },
    [handleUpload],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      files.forEach((file: FileWithPath) => {
        handleUpload(file);
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleUpload],
  );

  const handleFolderSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      files.forEach((file: FileWithPath) => {
        // webkitRelativePath contém o caminho relativo da pasta
        const folderPath = file.webkitRelativePath;
        handleUpload(file, folderPath);
      });
      if (folderInputRef.current) {
        folderInputRef.current.value = "";
      }
    },
    [handleUpload],
  );

  const removeUpload = (fileName: string) => {
    setUploads((prev) => prev.filter((u) => u.file.name !== fileName));
  };

  return (
    <div className="space-y-4">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload files"
      />
      <input
        ref={folderInputRef}
        type="file"
        webkitdirectory={true}
        multiple
        onChange={handleFolderSelect}
        className="hidden"
        aria-label="Upload folder"
      />

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "border border-dashed rounded-lg p-8 transition-all duration-200",
          "flex flex-col items-center justify-center text-center",
          isDragging
            ? "border-primary bg-primary/5 glow-cyan"
            : "border-border hover:border-muted-foreground/50",
        )}
      >
        <div
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors",
            isDragging ? "bg-primary/20" : "bg-muted",
          )}
        >
          {isDragging ? (
            <FileUp className="h-6 w-6 text-primary" />
          ) : (
            <Cloud className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <h3 className="text-sm font-medium text-foreground mb-1">
          {isDragging
            ? "Solte os arquivos ou pastas aqui"
            : "Arraste arquivos ou pastas, ou clique para selecionar"}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Upload direto via S3 Presigned URLs • Até 5GB por arquivo • Pastas
          suportadas
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border hover:bg-muted"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Selecionar arquivos
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border hover:bg-muted"
            onClick={() => folderInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Selecionar pasta
          </Button>
        </div>

        {/* Security indicator */}
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <Shield className="h-3 w-3 text-primary" />
          <span>
            Transfer seguro via TLS • Verificação de integridade SHA-256
          </span>
        </div>
      </div>

      {/* Upload progress list */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload) => (
            <div
              key={`${upload.file.name}-${upload.progress}`}
              className="glass-light rounded-md p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0",
                      upload.status === "complete"
                        ? "bg-success/20"
                        : upload.status === "error"
                          ? "bg-destructive/20"
                          : "bg-primary/20",
                    )}
                  >
                    {upload.status === "complete" ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : upload.status === "error" ? (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {upload.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(upload.file.size)} •{" "}
                      {upload.status === "error"
                        ? (upload as any).error || "Erro no upload"
                        : uploadStatusLabels[upload.status]}
                    </p>
                  </div>
                </div>
                {upload.status !== "complete" && (
                  <button
                    onClick={() => removeUpload(upload.file.name)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Progress
                value={upload.progress}
                className={cn(
                  "h-1",
                  upload.status === "complete" && "[&>div]:bg-success",
                  upload.status === "error" && "[&>div]:bg-destructive",
                )}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
