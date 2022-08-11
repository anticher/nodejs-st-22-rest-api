import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
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
import { ErrorLoggerInterceptor } from 'src/interceptors/error-logger.interceptor';
import { TimeLoggerInterceptor } from 'src/interceptors/time-logger.interceptor';

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
  ): Promise<User | null> {
    return await this.userService.get(id);
  }

  @Post()
  @UseInterceptors(
    new ErrorLoggerInterceptor('UserController', 'addUser'),
    new TimeLoggerInterceptor('UserController', 'addUser'),
  )
  addUser(
    @Body(new ValidationPipe({ whitelist: true })) createUserDto: CreateUserDto,
  ): Promise<UserResponse | null> {
    return this.userService.add(createUserDto);
  }

  @Put(':id')
  @UseInterceptors(
    new ErrorLoggerInterceptor('UserController', 'updateUser'),
    new TimeLoggerInterceptor('UserController', 'updateUser'),
  )
  updateUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe({ whitelist: true })) updateUserDto: UpdateUserDto,
  ): Promise<UserResponse | null> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseInterceptors(
    new ErrorLoggerInterceptor('UserController', 'removeUser'),
    new TimeLoggerInterceptor('UserController', 'removeUser'),
  )
  @HttpCode(204)
  removeUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    return this.userService.remove(id);
  }
}
