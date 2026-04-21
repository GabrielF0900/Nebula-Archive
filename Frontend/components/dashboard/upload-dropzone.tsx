import { useState, useCallback } from "react";
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

  const handleUpload = useCallback(
    async (file: File) => {
      if (!token) {
        console.error("Usuário não autenticado");
        const notification = NotificationTemplates.upload.uploadError(
          file.name,
          "Usuário não autenticado",
        );
        notify(notification);
        return;
      }

      // Mostrar notificação de início do upload
      const startNotification = NotificationTemplates.upload.uploadStart(
        file.name,
      );
      notify(startNotification);

      // Adicionar ao estado de uploads
      setUploads((prev) => [
        ...prev,
        { file, progress: 0, status: "generating-url" },
      ]);

      try {
        // 1. Gerar URL de upload assinada
        const { uploadUrl, fileKey } = await generateUploadUrl(
          file.name,
          file.type,
          token,
        );

        setUploads((prev) =>
          prev.map((u) =>
            u.file.name === file.name && u.status === "generating-url"
              ? { ...u, progress: 10, status: "uploading" }
              : u,
          ),
        );

        // 2. Fazer upload do arquivo para S3
        await uploadFileToS3(uploadUrl, file, (progress) => {
          setUploads((prev) =>
            prev.map((u) =>
              u.file.name === file.name && u.status === "uploading"
                ? { ...u, progress: Math.min(10 + progress * 0.7, 85) }
                : u,
            ),
          );
        });

        // 3. Validar integridade
        setUploads((prev) =>
          prev.map((u) =>
            u.file.name === file.name && u.status === "uploading"
              ? { ...u, progress: 95, status: "validating" }
              : u,
          ),
        );

        // 4. Registrar metadados no banco de dados
        await registerFileMetadata(
          {
            name: file.name,
            size: file.size,
            type: file.type,
            fileKey,
          },
          token,
        );

        // 5. Marcar como concluído
        setUploads((prev) =>
          prev.map((u) =>
            u.file.name === file.name && u.status === "validating"
              ? { ...u, progress: 100, status: "complete" }
              : u,
          ),
        );

        // Mostrar notificação de sucesso
        const successNotification = NotificationTemplates.upload.uploadSuccess(
          file.name,
        );
        notify(successNotification);

        // Remover da lista após 2 segundos
        setTimeout(() => {
          setUploads((prev) => prev.filter((u) => u.file.name !== file.name));
          onUploadComplete?.();
        }, 2000);
      } catch (error) {
        console.error("Erro no upload:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Erro desconhecido";

        // Mostrar notificação de erro
        const errorNotification = NotificationTemplates.upload.uploadError(
          file.name,
          errorMessage,
        );
        notify(errorNotification);

        setUploads((prev) =>
          prev.map((u) =>
            u.file.name === file.name
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

      const files = Array.from(e.dataTransfer.files);
      files.forEach((file) => handleUpload(file));
    },
    [handleUpload],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      files.forEach((file) => handleUpload(file));
      e.target.value = "";
    },
    [handleUpload],
  );

  const removeUpload = (fileName: string) => {
    setUploads((prev) => prev.filter((u) => u.file.name !== fileName));
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border border-dashed rounded-lg p-8 transition-all duration-200",
          "flex flex-col items-center justify-center text-center",
          isDragging
            ? "border-primary bg-primary/5 glow-cyan"
            : "border-border hover:border-muted-foreground/50",
        )}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload files"
        />

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
            ? "Solte os arquivos aqui"
            : "Arraste arquivos ou clique para selecionar"}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Upload direto via S3 Presigned URLs • Até 5GB por arquivo
        </p>

        <Button
          variant="outline"
          size="sm"
          className="border-border hover:bg-muted"
        >
          <Upload className="h-4 w-4 mr-2" />
          Selecionar arquivos
        </Button>

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
