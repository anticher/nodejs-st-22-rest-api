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
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../models/user.model';
import { CreateUserDto } from '../dto/create.dto';
import { UpdateUserDto } from '../dto/update.dto';
import { UserResponse } from '../models/user-response.model';
import { UserService } from '../services/user.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public getList(
    @Query('loginSubstring') loginSubstring?: string,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ): Promise<User[]> {
    return this.userService.getList({ loginSubstring, limit, offset });
  }

  @Get(':id')
  public async getUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<User | null | string> {
    const result = await this.userService.get(id);
    if (result === 'user does not exist') {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Public()
  @Post()
  public async addUser(
    @Body(new ValidationPipe({ whitelist: true })) createUserDto: CreateUserDto,
  ): Promise<UserResponse | null | string> {
    const result = await this.userService.add(createUserDto);
    if (result === 'login is already taken') {
      throw new HttpException('login is already taken', HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Put(':id')
  public async updateUser(
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
  @HttpCode(204)
  public async removeUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void | string> {
    const result = await this.userService.remove(id);
    if (result === 'user does not exist') {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
