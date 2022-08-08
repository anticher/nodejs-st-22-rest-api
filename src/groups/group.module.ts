import { Module } from '@nestjs/common';
import { GroupService } from './services/group.service';
import { GroupController } from './controllers/group.controller';
import { Group } from './models/group.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupRepositoryService } from './data-access/group-repository.data-access';
import { IsNameUniqueConstraint } from './validators/group-name-empty.validator';
import { UserGroup } from './models/user-group.model';
import { UserGroupRepositoryService } from './data-access/user-group-repository.data-acces';

@Module({
  imports: [SequelizeModule.forFeature([Group, UserGroup])],
  providers: [
    GroupService,
    GroupRepositoryService,
    IsNameUniqueConstraint,
    UserGroupRepositoryService,
  ],
  controllers: [GroupController],
  exports: [SequelizeModule],
})
export class GroupModule {}
