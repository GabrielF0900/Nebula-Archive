import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthserviceModule } from './authservice/auth.module';
import { UserModule } from './users/user.module';
import { AuthController } from './authservice/auth.controller';
import { StorageModule } from './storage/storage.module';
import { FilesModule } from './files/files.module';
import { DistributionModule } from './distribution/distribution.module';
import { MonitoringModule } from './monitoring/monitoring.module';

@Module({
  imports: [
    AuthserviceModule,
    UserModule,
    StorageModule,
    FilesModule,
    DistributionModule,
    MonitoringModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
