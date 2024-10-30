// transform.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        if (response.headersSent) {
          // Avoid modifying the response if it was already sent
          console.warn('Headers already sent, skipping transformation.');
          return data;
        }
        return instanceToPlain(data);
      }),
      catchError((err) => {
        console.error('Error during transformation:', err);
        return throwError(() => err);
      }),
      tap({
        complete: () => {
          // Ensure the response is properly closed when done
          if (!response.headersSent) {
            response.end();
          }
        },
      })
    );
  }
}
