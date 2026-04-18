import type { FileType } from '../types'

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function getFileType(mimeType: string): FileType {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document'
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar') || mimeType.includes('7z')) return 'archive'
  return 'other'
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()!.toUpperCase() : ''
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
