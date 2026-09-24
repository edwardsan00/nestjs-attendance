import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.ts';

async function bootstrap() {
  const logger = new Logger('UX');
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api/ux-asistencias');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const port = process.env.UX_PORT ?? 3000;
  await app.listen(port);

  logger.log(`Api corriendo en http://localhost:${port}/api/ux-asistencias`);
}
await bootstrap();
