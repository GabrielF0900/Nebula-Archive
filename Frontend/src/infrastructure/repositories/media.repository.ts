import type { IMediaRepository } from '@domain/repositories'
import type { MediaFile, StorageStats, FileStatus } from '@domain/entities'

const MEDIA_STORAGE_KEY = 'nebula_media'

// Edge locations simulation
const EDGE_LOCATIONS = [
  'us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1',
  'ap-southeast-1', 'ap-northeast-1', 'sa-east-1'
]

const getRandomEdgeLocations = () => {
  const count = Math.floor(Math.random() * 4) + 2
  const shuffled = [...EDGE_LOCATIONS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

const getStoredMedia = (): MediaFile[] => {
  const data = localStorage.getItem(MEDIA_STORAGE_KEY)
  if (!data) return generateMockMedia()
  return JSON.parse(data)
}

const storeMedia = (files: MediaFile[]) => {
  localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(files))
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Generate mock media files
function generateMockMedia(): MediaFile[] {
  const mockFiles: MediaFile[] = [
    {
      id: crypto.randomUUID(),
      name: 'corporate-presentation-2024.mp4',
      size: 256000000,
      type: 'video/mp4',
      status: 'processed',
      uploadedAt: new Date(Date.now() - 86400000 * 2),
      processedAt: new Date(Date.now() - 86400000 * 2 + 300000),
      userId: 'user-1',
      thumbnailUrl: '/thumbnails/video-1.jpg',
      edgeLocations: getRandomEdgeLocations(),
      metadata: {
        width: 3840,
        height: 2160,
        duration: 1847,
        codec: 'H.265/HEVC',
        bitrate: 12500,
        fps: 60,
        format: 'MP4',
        colorSpace: 'BT.2020',
        audioChannels: 6,
        audioCodec: 'AAC-LC',
        audioBitrate: 320,
      },
    },
    {
      id: crypto.randomUUID(),
      name: 'product-launch-keynote.mov',
      size: 512000000,
      type: 'video/quicktime',
      status: 'processing',
      uploadedAt: new Date(Date.now() - 3600000),
      userId: 'user-1',
      edgeLocations: getRandomEdgeLocations(),
    },
    {
      id: crypto.randomUUID(),
      name: 'team-photo-highres.raw',
      size: 85000000,
      type: 'image/raw',
      status: 'pending',
      uploadedAt: new Date(Date.now() - 1800000),
      userId: 'user-1',
    },
    {
      id: crypto.randomUUID(),
      name: 'corrupted-archive.zip',
      size: 128000000,
      type: 'application/zip',
      status: 'error',
      uploadedAt: new Date(Date.now() - 7200000),
      userId: 'user-1',
    },
    {
      id: crypto.randomUUID(),
      name: 'quarterly-report-video.mp4',
      size: 180000000,
      type: 'video/mp4',
      status: 'processed',
      uploadedAt: new Date(Date.now() - 86400000 * 5),
      processedAt: new Date(Date.now() - 86400000 * 5 + 180000),
      userId: 'user-1',
      edgeLocations: getRandomEdgeLocations(),
      metadata: {
        width: 1920,
        height: 1080,
        duration: 923,
        codec: 'H.264/AVC',
        bitrate: 8000,
        fps: 30,
        format: 'MP4',
        colorSpace: 'BT.709',
        audioChannels: 2,
        audioCodec: 'AAC-LC',
        audioBitrate: 256,
      },
    },
    {
      id: crypto.randomUUID(),
      name: 'brand-assets-2024.psd',
      size: 450000000,
      type: 'image/vnd.adobe.photoshop',
      status: 'processed',
      uploadedAt: new Date(Date.now() - 86400000 * 3),
      processedAt: new Date(Date.now() - 86400000 * 3 + 120000),
      userId: 'user-1',
      edgeLocations: getRandomEdgeLocations(),
      metadata: {
        width: 8000,
        height: 6000,
        colorSpace: 'Adobe RGB',
      },
    },
  ]

  storeMedia(mockFiles)
  return mockFiles
}

export class MediaRepository implements IMediaRepository {
  async getFiles(userId: string): Promise<MediaFile[]> {
    await delay(500)
    const files = getStoredMedia()
    return files.filter(f => f.userId === userId || userId === 'user-1')
  }

  async getFileById(fileId: string): Promise<MediaFile | null> {
    await delay(200)
    const files = getStoredMedia()
    return files.find(f => f.id === fileId) || null
  }

  async uploadFile(file: File, userId: string): Promise<MediaFile> {
    await delay(1500)

    const newFile: MediaFile = {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      uploadedAt: new Date(),
      userId,
    }

    const files = getStoredMedia()
    files.unshift(newFile)
    storeMedia(files)

    // Simulate processing after upload
    this.simulateProcessing(newFile.id)

    return newFile
  }

  private async simulateProcessing(fileId: string) {
    await delay(3000)
    
    const files = getStoredMedia()
    const fileIndex = files.findIndex(f => f.id === fileId)
    
    if (fileIndex === -1) return

    // 80% chance of success
    const success = Math.random() > 0.2
    
    files[fileIndex] = {
      ...files[fileIndex],
      status: success ? 'processed' : 'error' as FileStatus,
      processedAt: success ? new Date() : undefined,
      edgeLocations: success ? getRandomEdgeLocations() : undefined,
      metadata: success ? {
        width: 1920,
        height: 1080,
        codec: 'H.264/AVC',
        bitrate: 5000,
        fps: 30,
      } : undefined,
    }

    storeMedia(files)
  }

  async deleteFile(fileId: string): Promise<void> {
    await delay(500)
    const files = getStoredMedia()
    const filtered = files.filter(f => f.id !== fileId)
    storeMedia(filtered)
  }

  async getPresignedUrl(_fileName: string, _fileType: string): Promise<string> {
    await delay(300)
    // Simulated presigned URL
    return `https://nebula-storage.example.com/upload/${crypto.randomUUID()}`
  }

  async getStorageStats(userId: string): Promise<StorageStats> {
    await delay(300)
    const files = await this.getFiles(userId)
    
    const totalSize = files.reduce((acc, f) => acc + f.size, 0)
    const processedFiles = files.filter(f => f.status === 'processed').length
    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'processing').length
    const errorFiles = files.filter(f => f.status === 'error').length

    return {
      totalFiles: files.length,
      totalSize,
      processedFiles,
      pendingFiles,
      errorFiles,
      storageUsed: totalSize,
      storageLimit: 10737418240, // 10GB
    }
  }
}

export const mediaRepository = new MediaRepository()
