import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getList(
    @Query('loginSubstring') loginSubstring?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): User[] {
    return this.userService.getList({ loginSubstring, limit, offset });
  }

  @Get(':id')
  getUser(@Param('id') id: string): User {
    return this.userService.get(id);
  }

  @Post()
  addUser(@Body() createUserDto: CreateUserDto): User {
    return this.userService.add(createUserDto);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): User {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string): void {
    return this.userService.remove(id);
  }
}
