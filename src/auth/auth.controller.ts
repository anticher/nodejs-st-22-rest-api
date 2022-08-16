import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { ErrorLoggerInterceptor } from 'src/common/interceptors/error-logger.interceptor';
import { TimeLoggerInterceptor } from 'src/common/interceptors/time-logger.interceptor';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @UseInterceptors(
    new ErrorLoggerInterceptor('AuthController', 'login'),
    new TimeLoggerInterceptor('AuthController', 'login'),
  )
  public async login(
    @Body(new ValidationPipe({ whitelist: true })) loginDto: LoginDto,
  ): Promise<{ accessToken: string } | string> {
    const result = await this.authService.login(loginDto);
    if (typeof result === 'string') {
      console.log('mkmkmkmmk');
      throw new HttpException(result, HttpStatus.FORBIDDEN);
    }
    return result;
  }
}
