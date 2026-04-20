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

@Controller('distribution')
export class DistributionController {
  constructor(private readonly fileService: FileService) {}

  // Edge locations com dados realistas
  private readonly edgeLocations = [
    {
      code: 'GRU',
      name: 'São Paulo, Brasil',
      status: 'active',
      latency: '12ms',
      bandwidth: '10.5 Gbps',
    },
    {
      code: 'IAD',
      name: 'Virginia, EUA',
      status: 'active',
      latency: '89ms',
      bandwidth: '25.2 Gbps',
    },
    {
      code: 'FRA',
      name: 'Frankfurt, Alemanha',
      status: 'active',
      latency: '145ms',
      bandwidth: '15.8 Gbps',
    },
    {
      code: 'SYD',
      name: 'Sydney, Austrália',
      status: 'active',
      latency: '234ms',
      bandwidth: '8.3 Gbps',
    },
    {
      code: 'SGP',
      name: 'Singapura',
      status: 'active',
      latency: '156ms',
      bandwidth: '12.1 Gbps',
    },
    {
      code: 'TYO',
      name: 'Tokyo, Japão',
      status: 'active',
      latency: '189ms',
      bandwidth: '6.7 Gbps',
    },
  ];

  @Get()
  @UseGuards(JwtAuthGuard)
  async getDistribution(@Req() req: AuthenticatedRequest) {
    const userId = parseInt(req.user.userId);

    // Obter estatísticas reais do usuário
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const stats = await this.fileService.getTotalStats(userId);

    // Obter arquivos do usuário para distribuição mais realista
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const userFiles = await this.fileService.getUserFiles(userId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const totalUploads = stats.totalUploads || 0;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const totalBandwidthGB = stats.totalSize / (1024 * 1024 * 1024);

    // Se não há uploads, retornar distribuição inicial equilibrada
    if (totalUploads === 0) {
      return this.edgeLocations.map((location) => ({
        code: location.code,
        name: location.name,
        status: location.status,
        latency: location.latency,
        bandwidth: '0 GB',
        requests: 0,
        filesCount: 0,
        percentageDistributed: '0%',
      }));
    }

    // Calcular latência em ms para determinar preferência
    const locationsWithMetrics = this.edgeLocations.map((location) => {
      const latencyMs = parseInt(location.latency);
      // Localidades mais próximas recebem mais requisições
      const score = 1 / latencyMs;
      return {
        ...location,
        score,
        latencyMs,
      };
    });

    // Normalizar scores para usar como pesos
    const totalScore = locationsWithMetrics.reduce(
      (sum, loc) => sum + loc.score,
      0,
    );
    const normalizedWeights = locationsWithMetrics.map((loc) => ({
      ...loc,
      weight: loc.score / totalScore,
    }));

    // Distribuir uploads baseado nos pesos
    const distributedLocations = normalizedWeights.map((location) => {
      const filesCount = Math.round(totalUploads * location.weight);
      const bandwidthForLocation = (totalBandwidthGB * location.weight).toFixed(
        2,
      );
      const requestsCount = filesCount * 5; // Aproximadamente 5 requisições por arquivo
      const percentageDistributed = ((location.weight * 100) as number).toFixed(
        1,
      );

      return {
        code: location.code,
        name: location.name,
        status: location.status,
        latency: location.latency,
        bandwidth: `${bandwidthForLocation} GB`,
        requests: requestsCount,
        filesCount,
        percentageDistributed: `${percentageDistributed}%`,
      };
    });

    return distributedLocations;
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getDistributionStats(@Req() req: AuthenticatedRequest) {
    const userId = parseInt(req.user.userId);

    // Obter dados reais do usuário
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const stats = await this.fileService.getTotalStats(userId);

    // Calcular total de banda
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const totalBandwidthGB = (stats.totalSize / (1024 * 1024 * 1024)).toFixed(
      2,
    );

    // Calcular total de requisições (aproximado: 5 por arquivo)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const totalRequests = Math.max(stats.totalUploads * 5, 0);

    const activeLocations = this.edgeLocations.filter(
      (l) => l.status === 'active',
    ).length;

    // Calcular latência média
    const averageLatency = Math.round(
      this.edgeLocations.reduce((sum, loc) => {
        const latency = parseInt(loc.latency);
        return sum + latency;
      }, 0) / this.edgeLocations.length,
    );

    return {
      totalEdgeLocations: this.edgeLocations.length,
      activeLocations,
      totalBandwidth: `${totalBandwidthGB} GB`,
      totalRequests,
      averageLatency: `${averageLatency}ms`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      filesDistributed: stats.successfulUploads,
    };
  }
}
