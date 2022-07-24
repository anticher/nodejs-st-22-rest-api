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
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { UserResponse } from './models/user-response.model';
import { UserService } from './user.service';

@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getList(
    @Query('loginSubstring') loginSubstring?: string,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ): UserResponse[] {
    return this.userService.getList({ loginSubstring, limit, offset });
  }

  @Get(':id')
  getUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): UserResponse {
    return this.userService.get(id);
  }

  @Post()
  addUser(
    @Body(new ValidationPipe({ whitelist: true })) createUserDto: CreateUserDto,
  ): UserResponse | void {
    return this.userService.add(createUserDto);
  }

  @Put(':id')
  updateUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe({ whitelist: true })) updateUserDto: UpdateUserDto,
  ): UserResponse | void {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  removeUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): void {
    return this.userService.remove(id);
  }
}
