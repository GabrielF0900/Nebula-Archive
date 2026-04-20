import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module'; // Ajuste o caminho conforme seu projeto

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
