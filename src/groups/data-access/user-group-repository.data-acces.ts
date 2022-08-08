import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { UserGroupDto } from '../dto/user-group.dto';
import { UserGroup } from '../models/user-group.model';

@Injectable()
export class UserGroupRepositoryService {
  constructor(
    @InjectConnection()
    private sequelize: Sequelize,
    @InjectModel(UserGroup)
    private groupModel: typeof UserGroup,
  ) {}

  async add(UserGroupIds: UserGroupDto) {
    try {
      const result = await this.sequelize.transaction(async (t) => {
        const { groupId, userIds } = UserGroupIds;
        const promises = userIds.map((userId: string) => {
          const promise = this.groupModel.create(
            {
              userId,
              groupId,
            },
            { transaction: t },
          );
          return promise;
        });
        const promisesResult = await Promise.all(promises);
        return promisesResult;
      });
      return result;
    } catch (error) {
      return null;
    }
  }
}
