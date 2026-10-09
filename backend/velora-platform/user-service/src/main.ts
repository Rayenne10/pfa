import './otel';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.CORS_ORIGIN || 'http://localhost:8080', credentials: true });
  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT || 3000), '0.0.0.0');
}
bootstrap();
