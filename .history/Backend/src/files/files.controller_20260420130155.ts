import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { JwtAuthGuard } from '../authservice/jwt-auth.guard'; // ⚠️ Verifique se a pasta é 'authservice' ou 'auth'

@Controller('files')
export class FilesController {
  constructor(private readonly storageService: StorageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload-url')
  async getUploadUrl(
    @Body() body: { fileName: string; fileType: string },
    @Req() req: any,
  ) {
    // 1. Recuperamos o ID do usuário que o Guard colocou na requisição
    // Verifique no seu jwt.strategy.ts se você usou 'sub' ou 'userId'
    const userId = req.user.userId || req.user.sub; 

    // 2. Chamamos o serviço que você criou para gerar a URL
    return this.storageService.generateUploadUrl(
      body.fileName,
      body.fileType,
      userId,
    );
  }
}