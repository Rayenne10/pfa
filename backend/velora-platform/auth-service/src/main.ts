import axios from 'axios';
import './otel';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './libs/Interceptors/response.interceptor';
async function bootstrap() {
  if (!process.env.INTERNAL_API_TOKEN || process.env.INTERNAL_API_TOKEN.length < 32) throw new Error('INTERNAL_API_TOKEN must contain at least 32 characters');
  axios.defaults.timeout = 5000;
  axios.defaults.headers.common['x-internal-token'] = process.env.INTERNAL_API_TOKEN;
  const app = await NestFactory.create(AppModule);
app.enableCors({ origin: process.env.CORS_ORIGIN || 'http://localhost:8080', credentials: true });


  app.useGlobalPipes(new ValidationPipe());

app.useGlobalInterceptors({
  intercept(context, next) {
    const request = context.switchToHttp().getRequest();

    if (request.url === '/metrics') {
      return next.handle(); // skip interceptor
    }

    return new ResponseInterceptor().intercept(context, next);
  },
});
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT || 3000), '0.0.0.0');
}
bootstrap();
