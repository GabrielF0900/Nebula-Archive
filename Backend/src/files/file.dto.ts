export interface FileResponseDto {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'processing' | 'processed' | 'error';
  fileKey: string;
  uploadedAt: string;
  processedAt?: string;
  thumbnailUrl?: string;
  downloadUrl?: string;
  errorMessage?: string;
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
}

export interface FileMetadataDto {
  name: string;
  size: number;
  type: string;
  fileKey: string;
}

export interface UploadUrlResponseDto {
  uploadUrl: string;
  fileKey: string;
}

export interface DownloadUrlResponseDto {
  downloadUrl: string;
}

export interface DeleteFileResponseDto {
  message: string;
}
