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
import { UserGroupDto } from '../dto/user-group.dto';
import { GroupResponse } from '../models/group-response.model';
import { GroupService } from '../services/group.service';

@Controller('v1/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  public async getList(): Promise<GroupResponse[]> {
    return await this.groupService.getList();
  }

  @Get(':id')
  public async getGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<GroupResponse | null> {
    return await this.groupService.get(id);
  }

  @Post()
  public async addGroup(
    @Body(new ValidationPipe({ whitelist: true }))
    createGroupDto: CreateGroupDto,
  ): Promise<GroupResponse> {
    const result = await this.groupService.add(createGroupDto);
    if (result) {
      return result;
    }
    throw new HttpException('group is already exist', HttpStatus.BAD_REQUEST);
  }

  @Post('addUsersToGroup')
  public async addUsersToGroup(
    @Body() UserGroupIds: UserGroupDto,
  ): Promise<GroupResponse> {
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
  public async updateGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    updateGroupDto: UpdateGroupDto,
  ): Promise<GroupResponse> {
    const result = await this.groupService.update(id, updateGroupDto);
    if (result) {
      return result;
    }
    throw new HttpException('group does not exist', HttpStatus.NOT_FOUND);
  }

  @Delete(':id')
  @HttpCode(204)
  public async removeGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<null> {
    if (await this.groupService.remove(id)) {
      return null;
    }
    throw new HttpException('group does not exist', HttpStatus.NOT_FOUND);
  }
}
