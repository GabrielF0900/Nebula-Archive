import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { PrismaService } from '../prisma/prisma.service'

@Module({
    imports: []
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
