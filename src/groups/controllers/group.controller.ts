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
  ValidationPipe,
} from '@nestjs/common';
import { CreateGroupDto } from '../dto/create.dto';
import { UpdateGroupDto } from '../dto/update.dto';
import { GroupService } from '../services/group.service';

@Controller('v1/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  async getList() {
    return await this.groupService.getList();
  }

  @Get(':id')
  async getGroup(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.groupService.get(id);
  }

  @Post()
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

  @Post('addUserGroup')
  async addUserGroup(@Body() UserGroupIds: any) {
    const result = await this.groupService.addUsersToGroup(UserGroupIds);
    // if (result) {
    //   return result;
    // }
    // throw new HttpException('group is already exist', HttpStatus.BAD_REQUEST);
    return result;
  }

  @Put(':id')
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
