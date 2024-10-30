// main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.intercepter';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = process.env.PORT ?? 3000;

  const server = await app.listen(port);
  logger.log(`Application is running on port ${port}`);

  process.on('SIGINT', async () => {
    logger.log('Shutting down gracefully...');
    await app.close();
    server.close(() => {
      logger.log('HTTP server closed.');
      process.exit(0);
    });
  });
}
bootstrap();
