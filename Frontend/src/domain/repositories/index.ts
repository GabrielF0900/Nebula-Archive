import type { 
  User, 
  MediaFile, 
  StorageStats, 
  LoginCredentials, 
  RegisterCredentials 
} from '../entities'

// Auth Repository Interface
export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<User>
  register(credentials: RegisterCredentials): Promise<User>
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>
  resetPassword(email: string): Promise<void>
}

// Media Repository Interface
export interface IMediaRepository {
  getFiles(userId: string): Promise<MediaFile[]>
  getFileById(fileId: string): Promise<MediaFile | null>
  uploadFile(file: File, userId: string): Promise<MediaFile>
  deleteFile(fileId: string): Promise<void>
  getPresignedUrl(fileName: string, fileType: string): Promise<string>
  getStorageStats(userId: string): Promise<StorageStats>
}

// Upload Repository Interface
export interface IUploadRepository {
  generatePresignedUrl(fileName: string, fileType: string): Promise<{
    uploadUrl: string
    fileId: string
  }>
  uploadToPresignedUrl(url: string, file: File, onProgress: (progress: number) => void): Promise<void>
  validateUpload(fileId: string): Promise<boolean>
}
