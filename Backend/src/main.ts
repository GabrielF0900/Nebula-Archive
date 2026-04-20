import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo global para todas as rotas
  app.setGlobalPrefix('api');

  // Habilitar CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos que não estão no DTO
      forbidNonWhitelisted: true, // Dá erro se enviarem campos extras
      transform: true, // Transforma o JSON no objeto da classe DTO
    }),
  );

  console.log('🚀 O SISTEMA DE VALIDAÇÃO ESTÁ SENDO ATIVADO AGORA!');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Servidor rodando em http://localhost:${port}/api`);
}
bootstrap();
