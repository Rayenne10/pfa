import './otel';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { getEnabledCategories } from 'trace_events';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
});

  await app.listen(process.env.PORT || 3004);
}
bootstrap();