import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body(new ValidationPipe({ whitelist: true })) loginDto: LoginDto,
  ) {
    const result = await this.authService.login(loginDto);
    if (typeof result === 'string') {
      throw new HttpException(result, HttpStatus.FORBIDDEN);
    }
    return result;
  }
}
