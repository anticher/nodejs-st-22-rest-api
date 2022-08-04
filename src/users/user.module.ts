import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UserRepositoryService } from './data-access/users-repository.data-access';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserService, UserRepositoryService],
  controllers: [UserController],
  exports: [SequelizeModule],
})
export class UserModule {}
