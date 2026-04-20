import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { StorageService } from '../storage/storage.service';
import { JwtAuthGuard } from '../authservice/jwt-auth.guard';

interface AuthUser {
  userId: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

@Controller('files')
export class FilesController {
  constructor(private readonly storageService: StorageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload-url')
  async getUploadUrl(
    @Body() body: { fileName: string; fileType: string },
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;

    return this.storageService.generateUploadUrl(
      body.fileName,
      body.fileType,
      userId,
    );
  }
}
