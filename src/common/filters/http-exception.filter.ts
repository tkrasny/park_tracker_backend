import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    let errors: string[] = [];
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null) {
        if ('errors' in response && Array.isArray(response['errors'])) {
          errors = response['errors'] as string[];
        }
        if ('message' in response && typeof response['message'] === 'string') {
          message = response['message'];
        }
      }
    }

    const isDevelopment = this.configService.get('NODE_ENV') !== 'production';
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(errors.length > 0 && { errors }),
      ...(isDevelopment &&
        exception instanceof Error && {
          stack: exception.stack,
          name: exception.name,
        }),
    };

    // Enhanced error logging
    const errorDetails = {
      timestamp: new Date().toISOString(),
      request: {
        method: request.method,
        url: request.url,
        body: request.body,
        query: request.query,
        params: request.params,
        headers: {
          ...request.headers,
          authorization: request.headers.authorization
            ? '[REDACTED]'
            : undefined,
        },
      },
      error:
        exception instanceof Error
          ? {
              name: exception.name,
              message: exception.message,
              stack: exception.stack?.split('\n').map((line) => line.trim()),
              cause: exception.cause,
            }
          : {
              type: typeof exception,
              value: exception,
            },
    };

    // Log with appropriate level based on status
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status} ${message}`,
        errorDetails,
      );
    } else if (status >= 400) {
      this.logger.warn(
        `${request.method} ${request.url} - ${status} ${message}`,
        errorDetails,
      );
    }

    response.status(status).json(errorResponse);
  }
}
