import { Module } from '@nestjs/common';
import { MonitoringController } from './monitoring.controller';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [MonitoringController],
})
export class MonitoringModule {}
