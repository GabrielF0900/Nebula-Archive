import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  UseGuards,
  Req,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { StorageService } from '../storage/storage.service';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../authservice/jwt-auth.guard';
import { FileResponseDto } from './file.dto';

interface AuthUser {
  userId: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

@Controller('files')
export class FilesController {
  constructor(
    private readonly storageService: StorageService,
    private readonly fileService: FileService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Post('metadata')
  async registerFileMetadata(
    @Body()
    body: {
      name: string;
      size: number;
      type: string;
      fileKey: string;
    },
    @Req() req: AuthenticatedRequest,
  ): Promise<FileResponseDto> {
    const userId = parseInt(req.user.userId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const file = await this.fileService.createFile(
      userId,
      body.name,
      body.size,
      body.type,
      body.fileKey,
    );

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      id: (file as any).id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      name: (file as any).name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      size: (file as any).size,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      type: (file as any).type,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      status: (file as any).status,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      fileKey: (file as any).fileKey,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      uploadedAt: (file as any).createdAt,
    } as unknown as FileResponseDto;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async listFiles(
    @Req() req: AuthenticatedRequest,
    @Query('status') status?: string,
  ): Promise<FileResponseDto[]> {
    const userId = parseInt(req.user.userId);

    const files = await this.fileService.getUserFiles(userId, status);

    return (files as any[]).map((file: any) => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      id: file.id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      name: file.name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      size: file.size,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      type: file.type,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      status: file.status,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      fileKey: file.fileKey,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      uploadedAt: file.createdAt,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      processedAt: file.processedAt,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      thumbnailUrl: file.thumbnailUrl,
      // Para download, o frontend deve chamar o endpoint /:fileId/download-url
      downloadUrl: undefined,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      errorMessage: file.errorMessage,
      metadata: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        duration: file.duration,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        width: file.width,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        height: file.height,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        codec: file.codec,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        bitrate: file.bitrate,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        format: file.format,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        colorSpace: file.colorSpace,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        frameRate: file.frameRate,
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      edgeLocation: file.edgeLocation,
    })) as FileResponseDto[];
  }

  @UseGuards(JwtAuthGuard)
  @Get(':fileId/download-url')
  async getDownloadUrl(
    @Param('fileId') fileId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ downloadUrl: string }> {
    const userId = parseInt(req.user.userId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const file = await this.fileService.getFile(fileId, userId);

    if (!file) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    // Verificar se o arquivo existe no S3
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    const exists = await this.storageService.fileExists(file.fileKey);

    if (!exists) {
      throw new NotFoundException(
        'Arquivo não encontrado no servidor de armazenamento. O upload pode não ter sido concluído corretamente.',
      );
    }

    // Gerar URL de download pressinada
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    const downloadUrl = await this.storageService.generateDownloadUrl(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      file.fileKey,
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { downloadUrl };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':fileId')
  async deleteFile(
    @Param('fileId') fileId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = parseInt(req.user.userId);

    // Obter arquivo para pegar a chave do S3
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const file = await this.fileService.getFile(fileId, userId);
    if (!file) {
      throw new Error('Arquivo não encontrado');
    }

    // Deletar do S3
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await this.storageService.deleteObject(file.fileKey);

    // Deletar do banco de dados
    await this.fileService.deleteFile(fileId, userId);

    return { message: 'Arquivo deletado com sucesso' };
  }
}
