import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { PrismaModule }

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
