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
    const result: UserResponse[] = [];
    users.forEach((user) => {
      const { isDeleted, ...rest } = user;
      result.push(rest);
    });
    return result;
  }

  getUser(id: string): UserResponse | void {
    const user = this.list.users.find(
      (user) => user.id === id && user.isDeleted === false,
    );
    if (user) {
      const { isDeleted, ...rest } = user;
      return rest;
    }
    return;
  }

  addUser(user: User): UserResponse | void {
    this.list.users.push(user);
    return this.getUser(user.id);
  }

  updateUser(id: string, user: User): UserResponse | void {
    const userIndex = this.list.users.findIndex((user) => user.id === id);
    this.list.users[userIndex] = user;
    return this.getUser(user.id);
  }

  deleteUser(id: string): void {
    const user = this.list.users.find((user) => user.id === id);
    if (user) {
      user.isDeleted = true;
    }

    return;
  }
}
