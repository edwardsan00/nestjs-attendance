import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class CoreExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log('🚀 ~ CoreExceptionFilter ~ catch ~ exception:', exception);
    const logger = new Logger('Exceptions');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorData = exception?.response || exception;

    const statusCode =
      errorData?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    const message = errorData?.message || 'Error interno del servidor';

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
