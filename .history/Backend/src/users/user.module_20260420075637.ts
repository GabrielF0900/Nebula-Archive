import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { PrismaService } from '../prisma/prisma.service'

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
