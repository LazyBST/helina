import { LoggerService } from '@libs/logger';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService, private serviceName: string) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();

    const request = context.switchToHttp().getRequest();

    const { statusCode } = context.switchToHttp().getResponse();
    const {
      originalUrl,
      method,
      params,
      query,
      body,
      headers,
      hostname,
      url,
      protocol,
    } = request;

    const uniqueId = uuidv4();

    this.logger.info(
      `Request: id-${uniqueId} Serice Name-${
        this.serviceName
      }\t${method} ${protocol}://${hostname}${url}\t${JSON.stringify({
        originalUrl,
        params,
        query,
        body,
        headers,
      })}`,
    );

    return next.handle().pipe(
      tap((data) =>
        this.logger.info(
          `Response: id-${uniqueId} Serice Name-${
            this.serviceName
          }\t${method} ${protocol}://${hostname}${url}\tlatency: ${
            Date.now() - now
          }ms\t${JSON.stringify({
            statusCode,
            data,
          })}`,
        ),
      ),
    );
  }
}
