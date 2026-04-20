import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { File } from '@prisma/client';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async createFile(
    userId: number,
    fileName: string,
    fileSize: number,
    fileType: string,
    fileKey: string,
  ): Promise<File> {
    return this.prisma.file.create({
      data: {
        name: fileName,
        size: fileSize,
        type: fileType,
        fileKey,
        userId,
        status: 'processed',
        processedAt: new Date(),
      },
    });
  }

  async getUserFiles(userId: number, status?: string): Promise<File[]> {
    const where: any = { userId };
    if (status && status !== 'all') {
      where.status = status;
    }

    return this.prisma.file.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFile(fileId: string, userId: number): Promise<File | null> {
    return this.prisma.file.findFirst({
      where: { id: fileId, userId },
    });
  }

  async deleteFile(fileId: string, userId: number): Promise<void> {
    await this.prisma.file.deleteMany({
      where: { id: fileId, userId },
    });
  }

  async updateFileStatus(
    fileId: string,
    status: string,
    metadata?: any,
  ): Promise<File> {
    const updateData: any = { status };
    if (metadata) {
      Object.assign(updateData, metadata);
    }
    if (status === 'processed') {
      updateData.processedAt = new Date();
    }

    return this.prisma.file.update({
      where: { id: fileId },
      data: updateData,
    });
  }

  async getTotalStats(userId: number) {
    const files = await this.prisma.file.findMany({
      where: { userId },
    });

    const stats = {
      totalUploads: files.length,
      successfulUploads: files.filter((f) => f.status === 'processed').length,
      failedUploads: files.filter((f) => f.status === 'error').length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
      pendingUploads: files.filter(
        (f) => f.status === 'pending' || f.status === 'processing',
      ).length,
    };

    return stats;
  }
}
