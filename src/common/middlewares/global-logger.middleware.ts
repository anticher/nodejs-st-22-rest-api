import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { inspect } from 'util';

@Injectable()
export class GlobalLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  public use(request: Request, response: Response, next: NextFunction): any {
    response.on('close', () => {
      const { method, originalUrl } = request;
      const { statusCode } = response;
      const message = `
      
      Global-Logger:

      method: ${method}

      path: ${originalUrl}

      request: ${inspect(request)}

      response: ${inspect(response)}

      `;
      if (statusCode >= 500) {
        return this.logger.error(message);
      }
      if (statusCode >= 400) {
        return this.logger.warn(message);
      }
      return this.logger.log(message);
    });
    next();
  }
}
