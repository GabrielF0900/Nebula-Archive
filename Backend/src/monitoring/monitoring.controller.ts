import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../authservice/jwt-auth.guard';
import { FileService } from '../files/file.service';

interface AuthUser {
  userId: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('metrics')
  async getMetrics(@Req() req: AuthenticatedRequest) {
    const userId = parseInt(req.user.userId);
    const stats = await this.fileService.getTotalStats(userId);

    // Calcular tempo médio de processamento
    const averageProcessingTime = 45; // segundos (mock)
    const totalBandwidthUsed = (stats.totalSize / (1024 * 1024 * 1024)).toFixed(
      2,
    ); // GB

    return {
      totalUploads: stats.totalUploads,
      successfulUploads: stats.successfulUploads,
      failedUploads: stats.failedUploads,
      pendingUploads: stats.pendingUploads,
      averageProcessingTime,
      totalBandwidthUsed: `${totalBandwidthUsed} GB`,
      peakTime: '14:30',
      successRate:
        stats.totalUploads > 0
          ? ((stats.successfulUploads / stats.totalUploads) * 100).toFixed(1) +
            '%'
          : '0%',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('activity')
  async getActivityLog(@Req() req: AuthenticatedRequest) {
    const userId = parseInt(req.user.userId);

    // Mock data para log de atividades
    const activities = [
      {
        id: '1',
        type: 'upload',
        description: 'Arquivo enviado com sucesso',
        fileName: 'video-tutorial.mp4',
        status: 'success',
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutos atrás
      },
      {
        id: '2',
        type: 'processing',
        description: 'Processamento iniciado',
        fileName: 'presentation.pptx',
        status: 'processing',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
      },
      {
        id: '3',
        type: 'completion',
        description: 'Arquivo processado',
        fileName: 'report.pdf',
        status: 'success',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
      },
      {
        id: '4',
        type: 'distribution',
        description: 'Distribuído para 4 edge locations',
        fileName: 'video-tutorial.mp4',
        status: 'success',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
      },
      {
        id: '5',
        type: 'error',
        description: 'Falha ao processar arquivo',
        fileName: 'corrupted-file.zip',
        status: 'error',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hora atrás
      },
    ];

    return activities;
  }

  @UseGuards(JwtAuthGuard)
  @Get('bandwidth')
  async getBandwidthStats(@Req() req: AuthenticatedRequest) {
    // Mock data para estatísticas de banda
    return {
      today: '2.3 GB',
      thisWeek: '12.5 GB',
      thisMonth: '45.8 GB',
      limit: '100 GB',
      usage: 45.8,
      chart: [
        { time: '00:00', value: 1.2 },
        { time: '04:00', value: 0.8 },
        { time: '08:00', value: 2.1 },
        { time: '12:00', value: 3.4 },
        { time: '16:00', value: 2.9 },
        { time: '20:00', value: 4.2 },
        { time: '23:59', value: 2.3 },
      ],
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('performance')
  async getPerformanceStats(@Req() req: AuthenticatedRequest) {
    // Mock data para desempenho
    return {
      avgUploadSpeed: '45.2 Mbps',
      avgDownloadSpeed: '67.8 Mbps',
      avgProcessingTime: '45 segundos',
      peakHour: '14:00-15:00',
      reliability: '99.9%',
      uptime: '99.95%',
    };
  }
}
