import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../authservice/jwt-auth.guard';

interface AuthUser {
  userId: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

@Controller('distribution')
export class DistributionController {
  // Mock data para edge locations
  private readonly edgeLocations = [
    {
      code: 'GRU',
      name: 'São Paulo, Brasil',
      status: 'active',
      latency: '12ms',
      bandwidth: '10.5 Gbps',
      requests: 152430,
    },
    {
      code: 'IAD',
      name: 'Virginia, EUA',
      status: 'active',
      latency: '89ms',
      bandwidth: '25.2 Gbps',
      requests: 1024567,
    },
    {
      code: 'FRA',
      name: 'Frankfurt, Alemanha',
      status: 'active',
      latency: '145ms',
      bandwidth: '15.8 Gbps',
      requests: 523412,
    },
    {
      code: 'SYD',
      name: 'Sydney, Austrália',
      status: 'active',
      latency: '234ms',
      bandwidth: '8.3 Gbps',
      requests: 342156,
    },
    {
      code: 'SGP',
      name: 'Singapura',
      status: 'active',
      latency: '156ms',
      bandwidth: '12.1 Gbps',
      requests: 234789,
    },
    {
      code: 'TYO',
      name: 'Tokyo, Japão',
      status: 'inactive',
      latency: '189ms',
      bandwidth: '6.7 Gbps',
      requests: 156234,
    },
  ];

  @UseGuards(JwtAuthGuard)
  @Get()
  getDistribution(@Req() req: AuthenticatedRequest) {
    // Aqui você pode filtrar por usuário ou adicionar lógica específica
    return this.edgeLocations;
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getDistributionStats(@Req() req: AuthenticatedRequest) {
    const totalBandwidth = this.edgeLocations.reduce((sum, loc) => {
      const bandwidth = parseFloat(loc.bandwidth);
      return sum + bandwidth;
    }, 0);

    const totalRequests = this.edgeLocations.reduce((sum, loc) => {
      return sum + loc.requests;
    }, 0);

    const activeLocations = this.edgeLocations.filter(
      (l) => l.status === 'active',
    ).length;

    return {
      totalEdgeLocations: this.edgeLocations.length,
      activeLocations,
      totalBandwidth: totalBandwidth.toFixed(1) + ' Gbps',
      totalRequests,
      averageLatency:
        (
          this.edgeLocations.reduce((sum, loc) => {
            const latency = parseInt(loc.latency);
            return sum + latency;
          }, 0) / this.edgeLocations.length
        ).toFixed(0) + 'ms',
    };
  }
}
