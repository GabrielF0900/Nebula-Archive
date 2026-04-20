import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { JwtAuthGuard } from '../authservice/jwt-auth.guard';

@Controller('files')
export class FilesController {
  constructor(private readonly storageService: StorageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload-url') // 👈 Verifique se esta linha existe e está correta
  async getUploadUrl(@Body() body: any, @Req() req: any) {
    // ...
  }
}
