import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UserRepositoryService } from './users-repository.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserService, UserRepositoryService],
  controllers: [UserController],
  exports: [SequelizeModule],
})
export class UserModule {}
