import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from '../dto/create.dto';
import { UpdateUserDto } from '../dto/update.dto';
import { UserResponse } from '../models/user-response.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
export interface getListQueries {
  loginSubstring?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  public async getAll({
    loginSubstring,
    limit,
    offset,
  }: getListQueries): Promise<User[]> {
    return await this.userModel.findAll({
      offset,
      limit,
      where: {
        login: {
          [Op.iLike]: `%${loginSubstring}%`,
        },
        isDeleted: false,
      },
      attributes: { exclude: ['isDeleted', 'createdAt', 'updatedAt'] },
    });
  }

  public async getOne(id: string): Promise<User | null | string> {
    const user = await this.userModel.findOne({
      where: {
        id,
        isDeleted: false,
      },
      attributes: { exclude: ['isDeleted', 'createdAt', 'updatedAt'] },
    });
    if (!user) {
      return 'user does not exist';
    }
    return user;
  }

  public async getOneByName(name: string): Promise<User | string> {
    const user = await this.userModel.findOne({
      where: {
        login: name,
        isDeleted: false,
      },
      attributes: { exclude: ['isDeleted', 'createdAt', 'updatedAt'] },
    });
    if (!user) {
      return 'user does not exist';
    }
    return user;
  }

  public async add(
    createUserDto: CreateUserDto,
  ): Promise<UserResponse | string | null> {
    const users = await this.userModel.findAll();
    const loginIndex = users.findIndex((user) => {
      return user.login.toLowerCase() === createUserDto.login.toLowerCase();
    });
    if (loginIndex >= 0) {
      return 'login is already taken';
    }
    const { login, password, age } = createUserDto;
    const result = await this.userModel.create({
      id: uuid(),
      login,
      password,
      age,
    });
    return this.getOne(result.id);
  }

  public async updateOne(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse | string | null> {
    const user = await this.getOne(id);
    const userWithInPutLogin = await this.userModel.findOne({
      where: {
        login: updateUserDto.login,
      },
    });
    if (!user) {
      return 'user does not exist';
    }
    if (userWithInPutLogin && userWithInPutLogin.id !== id) {
      return 'login is already taken';
    }
    await this.userModel.update(updateUserDto, { where: { id } });
    return await this.getOne(id);
  }

  public async removeOne(id: string): Promise<void | string> {
    const affectedCount = await this.userModel.update(
      { isDeleted: true },
      { where: { id } },
    );
    if (affectedCount[0] !== 1) {
      return 'user does not exist';
    }
    return;
  }
}
