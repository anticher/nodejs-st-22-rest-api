import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { UserResponse } from './models/user-response.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
export interface getListQueries {
  loginSubstring?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async getAll({
    loginSubstring,
    limit,
    offset,
  }: getListQueries): Promise<User[]> {
    return await this.userModel.findAll({
      offset,
      limit,
      where: {
        login: {
          [Op.substring]: loginSubstring,
        },
        isDeleted: false,
      },
      attributes: { exclude: ['isDeleted', 'createdAt', 'updatedAt'] },
    });
  }

  async getOne(id: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: {
        id,
        isDeleted: false,
      },
      attributes: { exclude: ['isDeleted', 'createdAt', 'updatedAt'] },
    });
    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async add(createUserDto: CreateUserDto): Promise<UserResponse | null> {
    const users = await this.userModel.findAll();
    const loginIndex = users.findIndex((user) => {
      return user.login.toLowerCase() === createUserDto.login.toLowerCase();
    });
    if (loginIndex >= 0) {
      throw new HttpException('login is already taken', HttpStatus.BAD_REQUEST);
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

  async updateOne(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse | null> {
    const user = await this.getOne(id);
    const userWithInPutLogin = await this.userModel.findOne({
      where: {
        login: updateUserDto.login,
      },
    });
    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    }
    if (userWithInPutLogin && userWithInPutLogin.id !== id) {
      throw new HttpException('login is already taken', HttpStatus.BAD_REQUEST);
    }
    await this.userModel.update(updateUserDto, { where: { id } });
    return await this.getOne(id);
  }

  async removeOne(id: string): Promise<void> {
    const affectedCount = await this.userModel.update(
      { isDeleted: true },
      { where: { id } },
    );
    if (affectedCount[0] !== 1) {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
