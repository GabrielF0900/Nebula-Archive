import { Controller } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { JwtAuthGuard } from '../authservice/jwt-auth.guard';

@Controller('files')
export class FilesController {}
