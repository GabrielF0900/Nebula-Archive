import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { PrismaService } from '../prisma/prisma.service'; // Ajuste o caminho conforme seu projeto

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
