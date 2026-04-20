import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { PrismaModule } from '../prisma/prisma.service';

@Module({
  imports: [PrismaService],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
