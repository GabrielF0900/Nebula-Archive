import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { LogoutModule } from './logout/logout.module';
import { AuthserviceModule } from './authservice/auth.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [LoginModule, RegisterModule, LogoutModule, AuthserviceModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
