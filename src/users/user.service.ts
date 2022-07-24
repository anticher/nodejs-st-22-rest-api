import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IMDBService } from 'src/db/in-memory-db.service';
import { User } from './models/user.model';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { UserResponse } from './models/user-response.model';

interface getListQueries {
  loginSubstring?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class UserService {
  constructor(private readonly db: IMDBService) {}

  getList({ loginSubstring, limit, offset }: getListQueries): UserResponse[] {
    let result = this.db.getUsers();
    result.sort((a, b) =>
      a.login.localeCompare(b.login, 'en', { sensitivity: 'case' }),
    );
    if (loginSubstring) {
      result = result.filter((user) =>
        user.login.toLowerCase().includes(loginSubstring.toLowerCase()),
      );
    }
    if (offset) {
      result = result.slice(offset);
    }
    if (limit) {
      result = result.slice(0, limit);
    }
    return result;
  }

  get(id: string): UserResponse {
    const user = this.db.getUser(id);
    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  add(createUserDto: CreateUserDto): UserResponse | void {
    const users = this.db.getUsers();
    const loginIndex = users.findIndex((user) => {
      return user.login.toLowerCase() === createUserDto.login.toLowerCase();
    });
    if (loginIndex >= 0) {
      throw new HttpException('login is already taken', HttpStatus.BAD_REQUEST);
    }
    const { login, password, age } = createUserDto;
    const user: User = {
      id: uuid(),
      login,
      password,
      age,
      isDeleted: false,
    };
    return this.db.addUser(user);
  }

  update(id: string, updateUserDto: UpdateUserDto): UserResponse | void {
    const users = this.db.getUsers();
    const user = this.db.getUser(id);
    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    }
    if (
      user.login !== updateUserDto.login &&
      users.filter((user) => user.login === updateUserDto.login).length > 0
    ) {
      throw new HttpException('login is already taken', HttpStatus.BAD_REQUEST);
    }
    const updatedUser = Object.assign(user, { isDeleted: false });
    for (const [key, value] of Object.entries(updateUserDto)) {
      if (value !== undefined) {
        updatedUser[key] = value;
      }
    }
    return this.db.updateUser(id, updatedUser);
  }

  remove(id: string): void {
    if (!this.db.getUser(id)) {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    }
    this.db.deleteUser(id);
  }
}
