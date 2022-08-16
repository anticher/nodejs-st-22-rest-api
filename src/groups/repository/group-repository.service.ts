import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateGroupDto } from '../dto/create.dto';
import { UpdateGroupDto } from '../dto/update.dto';
import { Group } from '../models/group.model';
import { v4 as uuid } from 'uuid';
import { User } from 'src/users/models/user.model';
import { UserGroupDto } from '../dto/user-group.dto';
import { Sequelize } from 'sequelize-typescript';
import { GroupResponse } from '../models/group-response.model';

@Injectable()
export class GroupRepositoryService {
  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(Group)
    private readonly groupModel: typeof Group,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  public async getAll(): Promise<GroupResponse[]> {
    return await this.groupModel.findAll();
  }

  public async getOneByName(name: string): Promise<GroupResponse | null> {
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

  public async getOne(id: string): Promise<GroupResponse | null> {
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

  public async add(
    createGroupDto: CreateGroupDto,
  ): Promise<GroupResponse | null> {
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

  public async updateOne(
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<GroupResponse | null> {
    const group = await this.getOne(id);
    if (!group) {
      return null;
    }
    await this.groupModel.update(updateGroupDto, { where: { id } });
    return await this.getOne(id);
  }

  public async removeOne(id: string): Promise<number | null> {
    const group = await this.getOne(id);
    if (!group) {
      return null;
    }
    return this.groupModel.destroy({ where: { id } });
  }

  public async addUsersToGroup(
    userGroupIds: UserGroupDto,
  ): Promise<GroupResponse | null> {
    try {
      return await this.sequelize.transaction(async (t) => {
        const { groupId, userIds } = userGroupIds;
        const group = await this.groupModel.findByPk(groupId, {
          transaction: t,
        });
        if (!group) {
          return null;
        }
        const groupUsers = await Promise.all(
          userIds.map(async (id) => {
            const user = await this.userModel.findOne({
              where: { id },
              rejectOnEmpty: true,
              transaction: t,
            });
            return user;
          }),
        );
        await group.$add('users', groupUsers, { transaction: t });
        return group;
      });
    } catch (e) {
      return null;
    }
  }
}
