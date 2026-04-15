import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { JwtModule } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],

  controllers: [RegisterController],
  providers: [RegisterService, Prisma],
})
export class RegisterModule {}
