import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET || 'default_secret_key',
    signOptions: { expiresIn: '1h' },
  })],
  controllers: [],
  providers: [],
})
export class AuthserviceModule {}
