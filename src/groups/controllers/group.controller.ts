import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ControllerLoggerInterceptor } from 'src/interceptors/controller-logger.interceptor';
import { CreateGroupDto } from '../dto/create.dto';
import { UpdateGroupDto } from '../dto/update.dto';
import { UserGroupDto } from '../dto/user-group.dto';
import { GroupService } from '../services/group.service';

@Controller('v1/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  @UseInterceptors(
    new ControllerLoggerInterceptor('GroupController', 'getList'),
  )
  async getList() {
    return await this.groupService.getList();
  }

  @Get(':id')
  @UseInterceptors(
    new ControllerLoggerInterceptor('GroupController', 'getGroup'),
  )
  async getGroup(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.groupService.get(id);
  }

  @Post()
  @UseInterceptors(
    new ControllerLoggerInterceptor('GroupController', 'addGroup'),
  )
  async addGroup(
    @Body(new ValidationPipe({ whitelist: true }))
    createGroupDto: CreateGroupDto,
  ) {
    const result = await this.groupService.add(createGroupDto);
    if (result) {
      return result;
    }
    throw new HttpException('group is already exist', HttpStatus.BAD_REQUEST);
  }

  @Post('addUsersToGroup')
  @UseInterceptors(
    new ControllerLoggerInterceptor('GroupController', 'addUsersToGroup'),
  )
  async addUsersToGroup(@Body() UserGroupIds: UserGroupDto) {
    const result = await this.groupService.addUsersToGroup(UserGroupIds);
    if (result) {
      return result;
    }
    throw new HttpException(
      'something went wrong',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Put(':id')
  @UseInterceptors(
    new ControllerLoggerInterceptor('GroupController', 'updateGroup'),
  )
  async updateGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    updateGroupDto: UpdateGroupDto,
  ) {
    const result = await this.groupService.update(id, updateGroupDto);
    if (result) {
      return result;
    }
    throw new HttpException('group does not exist', HttpStatus.NOT_FOUND);
  }

  @Delete(':id')
  @UseInterceptors(
    new ControllerLoggerInterceptor('GroupController', 'removeGroup'),
  )
  @HttpCode(204)
  async removeGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    if (await this.groupService.remove(id)) {
      return null;
    }
    throw new HttpException('group does not exist', HttpStatus.NOT_FOUND);
  }
}
