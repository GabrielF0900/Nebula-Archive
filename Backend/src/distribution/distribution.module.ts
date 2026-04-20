import { Module } from '@nestjs/common';
import { DistributionController } from './distribution.controller';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [DistributionController],
})
export class DistributionModule {}
