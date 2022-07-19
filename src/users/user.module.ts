import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { IMDBService } from 'src/db/in-memory-db.service';

@Module({
  providers: [UserService, IMDBService],
  controllers: [UserController],
})
export class UserModule {}
