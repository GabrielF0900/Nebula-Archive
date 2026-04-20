import { Module } from '@nestjs/common';

@Module({
  providers: [Users],
  exports: [],
})
export class UserModule {}
