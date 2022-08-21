import { Injectable } from '@nestjs/common';
import { GroupRepositoryService } from '../repository/group-repository.service';
import { CreateGroupDto } from '../dto/create.dto';
import { UpdateGroupDto } from '../dto/update.dto';
import { UserGroupDto } from '../dto/user-group.dto';
import { GroupResponse } from '../models/group-response.model';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepositoryService: GroupRepositoryService,
  ) {}

  public async getList(): Promise<GroupResponse[]> {
    return await this.groupRepositoryService.getAll();
  }

  public async get(id: string): Promise<GroupResponse | null> {
    return await this.groupRepositoryService.getOne(id);
  }

  public async getOneByName(name: string): Promise<GroupResponse | null> {
    return await this.groupRepositoryService.getOneByName(name);
  }

  public async add(
    createGroupDto: CreateGroupDto,
  ): Promise<GroupResponse | null> {
    return await this.groupRepositoryService.add(createGroupDto);
  }

  public async addUsersToGroup(
    userGroupIds: UserGroupDto,
  ): Promise<GroupResponse | null> {
    return await this.groupRepositoryService.addUsersToGroup(userGroupIds);
  }

  public async update(
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<GroupResponse | null> {
    return this.groupRepositoryService.updateOne(id, updateGroupDto);
  }

  public async remove(id: string): Promise<number | null> {
    return await this.groupRepositoryService.removeOne(id);
  }
}
