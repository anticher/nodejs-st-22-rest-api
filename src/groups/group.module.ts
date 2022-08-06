import { Module } from '@nestjs/common';
import { GroupService } from './services/group.service';
import { GroupController } from './controllers/group.controller';
import { Group } from './models/group.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupRepositoryService } from './data-access/group-repository.data-access';

@Module({
  imports: [SequelizeModule.forFeature([Group])],
  providers: [GroupService, GroupRepositoryService],
  controllers: [GroupController],
  exports: [SequelizeModule],
})
export class GroupModule {}
