import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.model';
import { DBlist } from './db-list.model';

@Injectable()
export class IMDBService {
  private list: DBlist = {
    users: [],
  };

  getUsers(): User[] {
    return this.list.users;
  }

  getUser(id: string): User {
    return this.list.users.find((user) => user.id === id);
  }

  addUser(user: User): User {
    this.list.users.push(user);
    return user;
  }

  updateUser(id: string, userInfo: User): User {
    const user = this.list.users.find((user) => user.id === id);
    for (const [key, value] of Object.entries(userInfo)) {
      if (value !== undefined) {
        user[key] = value;
      }
    }
    return user;
  }

  deleteUser(id: string): void {
    this.list.users = this.list.users.filter((user) => user.id !== id);
    return;
  }
}
