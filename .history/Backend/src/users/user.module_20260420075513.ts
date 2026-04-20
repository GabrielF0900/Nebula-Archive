import { Module } from '@nestjs/common';
import { UsersService } from './user.service';

@Module({
  providers: [UsersService],
  exports: [],
})
export class UserModule {}
