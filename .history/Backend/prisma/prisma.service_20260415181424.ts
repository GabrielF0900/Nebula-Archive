import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Esse método garante que a aplicação só inicie depois de conectar ao banco
  async onModuleInit() {
    await this.$connect();
  }
}