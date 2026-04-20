import { Controller } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Certifique-se de que o caminho está correto

@Controller('files')
export class FilesController {}
