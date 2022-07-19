import { Injectable } from '@nestjs/common';
import { IMDBService } from 'src/db/in-memory-db.service';
import { User } from './user.model';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';

interface getListQueries {
  loginSubstring?: string;
  limit?: string;
  offset?: string;
}

@Injectable()
export class UserService {
  constructor(private readonly db: IMDBService) {}

  getList({ loginSubstring, limit, offset }: getListQueries): User[] {
    let result = this.db.getUsers().filter((user) => user.isDeleted !== true);
    if (loginSubstring) {
      result = result.filter((user) =>
        user.login.toLowerCase().includes(loginSubstring.toLowerCase()),
      );
    }
    if (limit) {
      result = offset
        ? result.slice(+offset, +offset + +limit)
        : result.slice(0, +limit);
    } else if (offset) {
      result = result.slice(+offset);
    }
    return result.sort((a, b) =>
      a.login.localeCompare(b.login, 'en', { sensitivity: 'base' }),
    );
  }

  get(id: string): User {
    const user = this.db.getUser(id);
    return !user.isDeleted ? user : null;
  }

  add(createUserDto: CreateUserDto): User {
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

  update(id: string, updateUserDto: UpdateUserDto): User {
    const newUserInfo = Object.assign({}, this.db.getUser(id));
    for (const [key, value] of Object.entries(updateUserDto)) {
      if (value !== undefined) {
        newUserInfo[key] = value;
      }
    }
    return this.db.updateUser(id, newUserInfo);
  }

  remove(id: string): void {
    return this.db.deleteUser(id);
  }
}
