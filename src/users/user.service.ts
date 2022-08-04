import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { UserResponse } from './models/user-response.model';
import { User } from './models/user.model';
import {
  getListQueries,
  UserRepositoryService,
} from './users-repository.service';

@Injectable()
export class UserService {
  constructor(private userRepositoryService: UserRepositoryService) {}

  async getList({
    loginSubstring,
    limit,
    offset,
  }: getListQueries): Promise<User[]> {
    return await this.userRepositoryService.getAll({
      loginSubstring,
      limit,
      offset,
    });
  }

  async get(id: string): Promise<User | null> {
    return await this.userRepositoryService.getOne(id);
  }

  async add(createUserDto: CreateUserDto): Promise<UserResponse | null> {
    return await this.userRepositoryService.add(createUserDto);
  }

  update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse | null> {
    return this.userRepositoryService.updateOne(id, updateUserDto);
  }

  async remove(id: string): Promise<void> {
    return await this.userRepositoryService.removeOne(id);
  }
}
