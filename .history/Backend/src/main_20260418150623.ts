import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos que não estão no DTO
      forbidNonWhitelisted: true, // Dá erro se enviarem campos extras
      transform: true, // Transforma o JSON no objeto da classe DTO
    }),
  );

  console.log('🚀 O SISTEMA DE VALIDAÇÃO ESTÁ SENDO ATIVADO AGORA!');

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
