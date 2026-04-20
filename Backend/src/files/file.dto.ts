export class FileResponseDto {
  id: string;
  name: string;
  size: number;
  type: string;
  status: string;
  fileKey: string;
  uploadedAt: Date;
  processedAt?: Date;
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

export class FileMetadataDto {
  name: string;
  size: number;
  type: string;
  fileKey: string;
}

export class UploadUrlResponseDto {
  uploadUrl: string;
  fileKey: string;
}

export class DownloadUrlResponseDto {
  downloadUrl: string;
}
