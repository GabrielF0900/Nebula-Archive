import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { PrismaService } from '../prisma/prisma.service';
import { Authservice } from '../'

@Module({
  imports: [AuthserviceModule],

  controllers: [RegisterController],
  providers: [RegisterService, PrismaService],
})
export class RegisterModule {}
