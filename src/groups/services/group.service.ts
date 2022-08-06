import { Injectable } from '@nestjs/common';
import { GroupRepositoryService } from '../data-access/group-repository.data-access';
import { CreateGroupDto } from '../dto/create.dto';
import { UpdateGroupDto } from '../dto/update.dto';

@Injectable()
export class GroupService {
  constructor(private groupRepositoryService: GroupRepositoryService) {}

  async getList() {
    return await this.groupRepositoryService.getAll();
  }

  async get(id: string) {
    return await this.groupRepositoryService.getOne(id);
  }

  async getOneByName(name: string) {
    return await this.groupRepositoryService.getOneByName(name);
  }

  async add(createGroupDto: CreateGroupDto) {
    return await this.groupRepositoryService.add(createGroupDto);
  }

  update(id: string, updateGroupDto: UpdateGroupDto) {
    return this.groupRepositoryService.updateOne(id, updateGroupDto);
  }

  async remove(id: string) {
    return await this.groupRepositoryService.removeOne(id);
  }
}
