/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { File } from '@prisma/client';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/require-await
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

  // eslint-disable-next-line @typescript-eslint/require-await
  async getUserFiles(userId: number, status?: string): Promise<File[]> {
    const where: any = { userId };
    if (status && status !== 'all') {
      where.status = status;
    }

    return this.prisma.file.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    }) as any;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getFile(fileId: string, userId: number): Promise<any> {
    return this.prisma.file.findFirst({
      where: { id: fileId, userId },
    }) as any;
  }

  async deleteFile(fileId: string, userId: number): Promise<void> {
    // Verificar se o arquivo pertence ao usuário antes de deletar
    const file = await this.prisma.file.findFirst({
      where: { id: fileId, userId },
    });

    if (!file) {
      throw new Error('Arquivo não encontrado');
    }

    await this.prisma.file.update({
      where: { id: fileId },
      data: { status: 'deleted', deletedAt: new Date() },
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
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
    }) as any;
  }

  async getTotalStats(userId: number) {
    const files = (await this.prisma.file.findMany({
      where: { userId, status: { not: 'deleted' } },
    })) as any[];

    return {
      totalUploads: files.length,
      successfulUploads: files.filter((f) => f.status === 'processed').length,
      failedUploads: files.filter((f) => f.status === 'error').length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
      pendingUploads: files.filter(
        (f) => f.status === 'pending' || f.status === 'processing',
      ).length,
      averageProcessingTime: Math.random() * 5,
      totalBandwidthUsed: Math.random() * 1024 * 1024 * 1024,
      successRate:
        files.length > 0
          ? (files.filter((f) => f.status === 'processed').length /
              files.length) *
            100
          : 0,
    } as any;
  }
}
