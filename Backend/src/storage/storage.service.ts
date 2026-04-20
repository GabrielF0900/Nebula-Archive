import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async generateUploadUrl(
    fileName: string,
    fileType: string,
    userId: string | number,
  ) {
    // Geramos um caminho único: nebula/ID_USUARIO/TIMESTAMP-NOME_ARQUIVO
    const fileKey = `nebula/${userId}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
    });

    // A URL será válida por 5 minutos (300 segundos)
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 300 });

    return {
      uploadUrl: url,
      fileKey: fileKey,
    };
  }

  async deleteObject(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error('Erro ao deletar objeto do S3:', error);
      throw new Error('Erro ao deletar arquivo do S3');
    }
  }
}
