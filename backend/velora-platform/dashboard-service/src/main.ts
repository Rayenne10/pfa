import './otel';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: process.env.CORS_ORIGIN || 'http://localhost:8080', credentials: true });

  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT || 3000), '0.0.0.0');
}
bootstrap();
