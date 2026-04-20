export type FileStatus = "pending" | "processing" | "processed" | "error";

export interface MediaFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  uploadedAt: Date;
  processedAt?: Date;
  thumbnailUrl?: string;
  downloadUrl?: string;
  metadata?: FileMetadata;
  edgeLocation?: string;
  errorMessage?: string;
}

export interface FileMetadata {
  duration?: number;
  width?: number;
  height?: number;
  codec?: string;
  bitrate?: number;
  format?: string;
  colorSpace?: string;
  frameRate?: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: Date;
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: "generating-url" | "uploading" | "validating" | "complete" | "error";
  error?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
