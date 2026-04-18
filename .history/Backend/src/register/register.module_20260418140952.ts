import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../authservice/authservice';
import { AuthserviceModule } from '../authservice/authservice.module';

@Module({
  imports: [AuthserviceModule, l],

  controllers: [RegisterController],
  providers: [RegisterService, PrismaService],
})
export class RegisterModule {}
