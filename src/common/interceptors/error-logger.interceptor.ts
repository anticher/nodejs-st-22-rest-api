import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inspect } from 'util';

@Injectable()
export class ErrorLoggerInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const http = context.switchToHttp();
        const request = http.getRequest();
        const response = http.getResponse();
        const method = context.getHandler().name;
        const controller = context.getClass().name;
        console.log(`

        Controller-Logger:

        constroller: ${controller}

        method: ${method}

        request: ${inspect(request)}

        response: ${inspect(response)}

        `);
        return throwError(() => new Error(err));
      }),
    );
  }
}
