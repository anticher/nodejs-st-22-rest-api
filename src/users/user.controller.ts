import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getList(): User[] {
    return this.userService.getList();
  }

  @Get(':id')
  getUser(@Param('id') id: string): User {
    return this.userService.get(id);
  }

  @Post()
  addUser(@Body() user: User): User {
    return this.userService.add(user);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() user: User): User {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string): void {
    return this.userService.remove(id);
  }
}
