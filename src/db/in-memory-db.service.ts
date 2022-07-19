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

  updateUser(id: string, newUserInfo: User): User {
    const userIndex = this.list.users.findIndex((user) => user.id === id);
    this.list.users[userIndex] = newUserInfo;
    return this.list.users[userIndex];
  }

  deleteUser(id: string): void {
    const user = this.list.users.find((user) => user.id === id);
    user.isDeleted = true;
    return;
  }
}
