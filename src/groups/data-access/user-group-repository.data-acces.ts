import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserGroup } from '../models/user-group.model';

@Injectable()
export class UserGroupRepositoryService {
  constructor(
    @InjectModel(UserGroup)
    private groupModel: typeof UserGroup,
  ) {}

  async add(UserGroupIds: any) {
    const { groupId, userIds } = UserGroupIds;
    const promises = userIds.map((userId: string) => {
      const promise = this.groupModel.create({
        userId,
        groupId,
      });
      return promise;
    });
    const result = await Promise.all(promises);
    return result;
  }
}
