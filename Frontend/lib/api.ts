const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface GenerateUploadUrlResponse {
  uploadUrl: string;
  fileKey: string;
}

export interface FileMetadataRequest {
  name: string;
  size: number;
  type: string;
  fileKey: string;
}

export interface FileResponse {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "pending" | "processing" | "processed" | "error";
  uploadedAt: string;
  processedAt?: string;
  thumbnailUrl?: string;
  downloadUrl?: string;
  fileKey: string;
  userId: number;
  metadata?: {
    duration?: number;
    width?: number;
    height?: number;
    codec?: string;
    bitrate?: number;
    format?: string;
    colorSpace?: string;
    frameRate?: number;
  };
  edgeLocation?: string;
  errorMessage?: string;
}

export interface DistributionResponse {
  code: string;
  name: string;
  status: "active" | "inactive";
  latency: string;
  bandwidth: string;
  requests: number;
}

export interface MonitoringMetrics {
  totalUploads: number;
  successfulUploads: number;
  failedUploads: number;
  averageProcessingTime: number;
  totalBandwidthUsed: number;
  peakTime: string;
}

/**
 * Gerar URL assinada para upload para S3
 */
export async function generateUploadUrl(
  fileName: string,
  fileType: string,
  token: string,
): Promise<GenerateUploadUrlResponse> {
  const response = await fetch(`${API_URL}/files/upload-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      fileName,
      fileType,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao gerar URL de upload");
  }

  return response.json();
}

/**
 * Fazer upload do arquivo diretamente para S3 usando a URL assinada
 */
export async function uploadFileToS3(
  uploadUrl: string,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Rastrear progresso
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgress?.(progress);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`Upload falhou com status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Erro ao fazer upload para S3"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload cancelado"));
    });

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

/**
 * Registrar metadados do arquivo após upload bem-sucedido
 */
export async function registerFileMetadata(
  metadata: FileMetadataRequest,
  token: string,
): Promise<FileResponse> {
  const response = await fetch(`${API_URL}/files/metadata`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao registrar metadados");
  }

  return response.json();
}

/**
 * Listar arquivos do usuário
 */
export async function listFiles(
  token: string,
  filter?: "all" | "processed" | "pending" | "error",
): Promise<FileResponse[]> {
  const url = new URL(`${API_URL}/files`);
  if (filter && filter !== "all") {
    url.searchParams.append("status", filter);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao listar arquivos");
  }

  return response.json();
}

/**
 * Obter informações de distribuição/edge locations
 */
export async function getDistributionInfo(
  token: string,
): Promise<DistributionResponse[]> {
  const response = await fetch(`${API_URL}/distribution`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao obter distribuição");
  }

  return response.json();
}

/**
 * Obter métricas de monitoramento
 */
export async function getMonitoringMetrics(
  token: string,
): Promise<MonitoringMetrics> {
  const response = await fetch(`${API_URL}/monitoring/metrics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao obter métricas");
  }

  return response.json();
}

/**
 * Deletar arquivo
 */
export async function deleteFile(fileId: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao deletar arquivo");
  }
}

/**
 * Obter URL de download do arquivo
 */
export async function getDownloadUrl(
  fileId: string,
  token: string,
): Promise<string> {
  const response = await fetch(`${API_URL}/files/${fileId}/download-url`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao obter URL de download");
  }

  const data = await response.json();
  return data.downloadUrl;
}

/**
 * Obter estatísticas de distribuição
 */
export async function getDistributionStats(token: string): Promise<any> {
  const response = await fetch(`${API_URL}/distribution/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Erro ao obter estatísticas de distribuição",
    );
  }

  return response.json();
}

/**
 * Obter atividades de monitoramento
 */
export async function getMonitoringActivity(token: string): Promise<any[]> {
  const response = await fetch(`${API_URL}/monitoring/activity`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao obter atividades");
  }

  return response.json();
}

/**
 * Obter estatísticas de bandwidth
 */
export async function getBandwidthStats(token: string): Promise<any> {
  const response = await fetch(`${API_URL}/monitoring/bandwidth`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao obter estatísticas de bandwidth");
  }

  return response.json();
}

/**
 * Obter estatísticas de performance
 */
export async function getPerformanceStats(token: string): Promise<any> {
  const response = await fetch(`${API_URL}/monitoring/performance`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Erro ao obter estatísticas de performance",
    );
  }

  return response.json();
}
