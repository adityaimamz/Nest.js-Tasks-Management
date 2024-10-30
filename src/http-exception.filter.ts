// http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (response.headersSent) {
      this.logger.warn('Response already sent, skipping further handling');
      return;
    }

    const status = exception.getStatus();
    const exceptionResponse =
      typeof exception.getResponse() === 'string'
        ? { message: exception.getResponse() }
        : (exception.getResponse() as Record<string, any>);

    this.logger.error(
      `Status: ${status} - Error: ${JSON.stringify(exceptionResponse)} - Path: ${request.url}`
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exceptionResponse,
    });
  }
}
