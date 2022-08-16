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
  private controller: string;
  private method: string;

  constructor(controller: string, method: string) {
    this.controller = controller;
    this.method = method;
  }

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `${this.controller} ${this.method} execution time: ${
              Date.now() - now
            }ms`,
          ),
        ),
      );
  }
}
