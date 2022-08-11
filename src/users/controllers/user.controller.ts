import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../models/user.model';
import { CreateUserDto } from '../dto/create.dto';
import { UpdateUserDto } from '../dto/update.dto';
import { UserResponse } from '../models/user-response.model';
import { UserService } from '../services/user.service';
import { ErrorLoggerInterceptor } from 'src/common/interceptors/error-logger.interceptor';
import { TimeLoggerInterceptor } from 'src/common/interceptors/time-logger.interceptor';

@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseInterceptors(
    new ErrorLoggerInterceptor('UserController', 'getList'),
    new TimeLoggerInterceptor('UserController', 'getList'),
  )
  getList(
    @Query('loginSubstring') loginSubstring?: string,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ): Promise<User[]> {
    return this.userService.getList({ loginSubstring, limit, offset });
  }

  @Get(':id')
  @UseInterceptors(
    new ErrorLoggerInterceptor('UserController', 'getUser'),
    new TimeLoggerInterceptor('UserController', 'getUser'),
  )
  async getUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<User | null | string> {
    const result = await this.userService.get(id);
    if (result === 'user does not exist') {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Post()
  @UseInterceptors(
    new ErrorLoggerInterceptor('UserController', 'addUser'),
    new TimeLoggerInterceptor('UserController', 'addUser'),
  )
  async addUser(
    @Body(new ValidationPipe({ whitelist: true })) createUserDto: CreateUserDto,
  ): Promise<UserResponse | null | string> {
    const result = await this.userService.add(createUserDto);
    if (result === 'login is already taken') {
      throw new HttpException('login is already taken', HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Put(':id')
  @UseInterceptors(
    new ErrorLoggerInterceptor('UserController', 'updateUser'),
    new TimeLoggerInterceptor('UserController', 'updateUser'),
  )
  async updateUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe({ whitelist: true })) updateUserDto: UpdateUserDto,
  ): Promise<UserResponse | null | string> {
    const result = await this.userService.update(id, updateUserDto);
    if (result === 'user does not exist') {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    }
    if (result === 'login is already taken') {
      throw new HttpException('login is already taken', HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Delete(':id')
  @UseInterceptors(
    new ErrorLoggerInterceptor('UserController', 'removeUser'),
    new TimeLoggerInterceptor('UserController', 'removeUser'),
  )
  @HttpCode(204)
  async removeUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void | string> {
    const result = await this.userService.remove(id);
    if (result === 'user does not exist') {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
