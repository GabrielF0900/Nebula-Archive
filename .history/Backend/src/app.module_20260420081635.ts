import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthserviceModule } from './authservice/auth.module';
import { UserModule } from './users/user.module';
import { AuthController } from './authservice/auth.controller';

@Module({
  imports: [, AuthserviceModule, UserModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
