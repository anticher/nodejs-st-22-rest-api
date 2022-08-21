import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TimeLoggerInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const now = Date.now();
    const method = context.getHandler().name;
    const controller = context.getClass().name;
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `${controller} ${method} execution time: ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
