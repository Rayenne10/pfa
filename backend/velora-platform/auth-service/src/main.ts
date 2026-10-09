import './otel';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './libs/Interceptors/response.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
});


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
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();