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
  controller: string;
  method: string;

  constructor(controller: string, method: string) {
    this.controller = controller;
    this.method = method;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const http = context.switchToHttp();
        const request = http.getRequest();
        const response = http.getResponse();
        console.log(`

        Controller-Logger:

        constroller: ${this.controller}

        method: ${this.method}

        request: ${inspect(request)}

        response: ${inspect(response)}

        `);
        console.log(this.method);
        return throwError(err);
      }),
    );
  }
}
