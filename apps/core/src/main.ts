import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ValidationError } from '@nestjs/common';
import {
  MicroserviceOptions,
  Transport,
  RpcException,
} from '@nestjs/microservices';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.CORE_TCP_HOST,
        port: Number(process.env.CORE_TCP_PORT) || 3001,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new RpcException({
          statusCode: 400,
          message: errors.map((error) =>
            Object.values(error.constraints || {}),
          ),
          error: 'Bad Request',
        });
      },
    }),
  );

  await app.listen();
}
bootstrap();
