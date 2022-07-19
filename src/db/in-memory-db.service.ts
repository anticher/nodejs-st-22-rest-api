import { Injectable } from '@nestjs/common';
import { UserResponse } from 'src/users/models/user-response.model';
import { User } from 'src/users/models/user.model';
import { DBlist } from './db-list.model';

@Injectable()
export class IMDBService {
  private list: DBlist = {
    users: [],
  };

  getUsers(): UserResponse[] {
    const users = this.list.users.filter((user) => user.isDeleted === false);
    let result = [...users];
    result = result.map((item) => {
      const newItem = Object.assign({}, item);
      delete newItem.isDeleted;
      return newItem;
    });
    return result;
  }

  getUser(id: string): UserResponse {
    const user = this.list.users.find((user) => user.id === id);
    if (user && user.isDeleted === false) {
      const result = Object.assign({}, user);
      delete result.isDeleted;
      return result;
    }
    return;
  }

  addUser(user: User): UserResponse {
    this.list.users.push(user);
    return this.getUser(user.id);
  }

  updateUser(id: string, user: User): UserResponse {
    const userIndex = this.list.users.findIndex((user) => user.id === id);
    this.list.users[userIndex] = user;
    return this.getUser(user.id);
  }

  deleteUser(id: string): void {
    const user = this.list.users.find((user) => user.id === id);
    user.isDeleted = true;
    return;
  }
}
