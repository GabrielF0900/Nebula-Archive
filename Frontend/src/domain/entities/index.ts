// User Entity
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'user' | 'viewer'
  createdAt: Date
}

// Media File Entity
export interface MediaFile {
  id: string
  name: string
  size: number
  type: string
  status: FileStatus
  uploadedAt: Date
  processedAt?: Date
  userId: string
  metadata?: MediaMetadata
  thumbnailUrl?: string
  url?: string
  edgeLocations?: string[]
}

export type FileStatus = 'pending' | 'processing' | 'processed' | 'error'

// Media Metadata Entity
export interface MediaMetadata {
  width?: number
  height?: number
  duration?: number
  codec?: string
  bitrate?: number
  fps?: number
  format?: string
  colorSpace?: string
  audioChannels?: number
  audioCodec?: string
  audioBitrate?: number
}

// Upload Progress Entity
export interface UploadProgress {
  fileId: string
  fileName: string
  progress: number
  status: UploadStatus
  error?: string
}

export type UploadStatus = 
  | 'generating-url' 
  | 'uploading' 
  | 'validating' 
  | 'complete' 
  | 'error'

// Storage Stats Entity
export interface StorageStats {
  totalFiles: number
  totalSize: number
  processedFiles: number
  pendingFiles: number
  errorFiles: number
  storageUsed: number
  storageLimit: number
}

// Auth Credentials
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}
