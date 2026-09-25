import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

type CoreException = {
  statusCode: number;
  message: string;
  error: string;
};

@Catch()
export class CoreExceptionFilter implements ExceptionFilter {
  catch(exception: CoreException, host: ArgumentsHost) {
    const logger = new Logger('Exceptions');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception?.message || 'Error interno del servidor';

    const error =
      exception?.error ||
      (statusCode >= 500 ? 'Internal Server Error' : 'Bad Request');

    logger.log(`Faild Request: ${request.method} - ${request.url}`);

    response.status(statusCode).json({
      statusCode,
      message,
      error,
    });
  }
}
