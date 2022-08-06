import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateGroupDto } from '../dto/create.dto';
import { UpdateGroupDto } from '../dto/update.dto';
import { Group } from '../models/group.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class GroupRepositoryService {
  constructor(
    @InjectModel(Group)
    private groupModel: typeof Group,
  ) {}

  async getAll() {
    return await this.groupModel.findAll();
  }

  async getOneByName(name: string) {
    console.log(name);
    const group = await this.groupModel.findOne({
      where: {
        name,
      },
    });
    if (!group) {
      return null;
    }
    return group;
  }

  async getOne(id: string) {
    const group = await this.groupModel.findOne({
      where: {
        id,
      },
    });
    if (!group) {
      return null;
    }
    return group;
  }

  async add(createGroupDto: CreateGroupDto) {
    const groupInDatabase = await this.groupModel.findOne({
      where: {
        name: createGroupDto.name,
      },
    });
    if (groupInDatabase) {
      return null;
    }
    const { name, permissions } = createGroupDto;
    const result = await this.groupModel.create({
      id: uuid(),
      name,
      permissions,
    });
    return this.getOne(result.id);
  }

  async updateOne(id: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.getOne(id);
    if (!group) {
      return null;
    }
    await this.groupModel.update(updateGroupDto, { where: { id } });
    return await this.getOne(id);
  }

  async removeOne(id: string) {
    const group = await this.getOne(id);
    if (!group) {
      return null;
    }
    return this.groupModel.destroy({ where: { id } });
  }
}
