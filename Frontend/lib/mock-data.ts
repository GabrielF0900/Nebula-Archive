import type { MediaFile } from "./types";

export const mockFiles: MediaFile[] = [
  {
    id: "file_001",
    name: "corporate_video_final_v3.mp4",
    size: 245_000_000,
    type: "video/mp4",
    status: "processed",
    uploadedAt: new Date("2024-03-15T10:30:00"),
    processedAt: new Date("2024-03-15T10:35:00"),
    thumbnailUrl: "/api/placeholder/160/90",
    downloadUrl: "https://cdn.nebula.io/files/corporate_video_final_v3.mp4",
    edgeLocation: "GRU (São Paulo)",
    metadata: {
      duration: 180,
      width: 1920,
      height: 1080,
      codec: "H.264",
      bitrate: 8_000_000,
      format: "MP4",
      colorSpace: "BT.709",
      frameRate: 30,
    },
  },
  {
    id: "file_002",
    name: "product_showcase_4k.mov",
    size: 1_200_000_000,
    type: "video/quicktime",
    status: "processing",
    uploadedAt: new Date("2024-03-18T14:20:00"),
    edgeLocation: "IAD (Virginia)",
  },
  {
    id: "file_003",
    name: "brand_assets_2024.zip",
    size: 85_000_000,
    type: "application/zip",
    status: "processed",
    uploadedAt: new Date("2024-03-17T09:15:00"),
    processedAt: new Date("2024-03-17T09:18:00"),
    downloadUrl: "https://cdn.nebula.io/files/brand_assets_2024.zip",
    edgeLocation: "FRA (Frankfurt)",
    metadata: {
      format: "ZIP",
    },
  },
  {
    id: "file_004",
    name: "interview_raw_footage.mp4",
    size: 3_500_000_000,
    type: "video/mp4",
    status: "pending",
    uploadedAt: new Date("2024-03-18T16:45:00"),
  },
  {
    id: "file_005",
    name: "social_media_batch_march.zip",
    size: 450_000_000,
    type: "application/zip",
    status: "error",
    uploadedAt: new Date("2024-03-16T11:00:00"),
    errorMessage: "Falha na validação de integridade - checksum inválido",
  },
  {
    id: "file_006",
    name: "presentation_keynote_2024.pptx",
    size: 125_000_000,
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    status: "processed",
    uploadedAt: new Date("2024-03-14T08:30:00"),
    processedAt: new Date("2024-03-14T08:32:00"),
    downloadUrl: "https://cdn.nebula.io/files/presentation_keynote_2024.pptx",
    edgeLocation: "NRT (Tokyo)",
    metadata: {
      format: "PPTX",
    },
  },
  {
    id: "file_007",
    name: "aerial_footage_drone_4k.mp4",
    size: 2_800_000_000,
    type: "video/mp4",
    status: "processed",
    uploadedAt: new Date("2024-03-13T15:20:00"),
    processedAt: new Date("2024-03-13T15:45:00"),
    thumbnailUrl: "/api/placeholder/160/90",
    downloadUrl: "https://cdn.nebula.io/files/aerial_footage_drone_4k.mp4",
    edgeLocation: "SYD (Sydney)",
    metadata: {
      duration: 420,
      width: 3840,
      height: 2160,
      codec: "H.265",
      bitrate: 45_000_000,
      format: "MP4",
      colorSpace: "BT.2020",
      frameRate: 60,
    },
  },
  {
    id: "file_008",
    name: "audio_podcast_ep47.wav",
    size: 680_000_000,
    type: "audio/wav",
    status: "processing",
    uploadedAt: new Date("2024-03-18T17:00:00"),
    edgeLocation: "CDG (Paris)",
  },
];

export const edgeLocations = [
  { code: "GRU", name: "São Paulo", latency: "12ms" },
  { code: "IAD", name: "Virginia", latency: "89ms" },
  { code: "FRA", name: "Frankfurt", latency: "145ms" },
  { code: "NRT", name: "Tokyo", latency: "215ms" },
  { code: "SYD", name: "Sydney", latency: "280ms" },
  { code: "CDG", name: "Paris", latency: "152ms" },
];

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}
