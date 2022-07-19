import { Injectable } from '@nestjs/common';
import { IMDBService } from 'src/db/in-memory-db.service';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(private readonly db: IMDBService) {}

  getList(): User[] {
    return this.db.getUsers();
  }
  get(id: string): User {
    return this.db.getUser(id);
  }

  add(user: User): User {
    return this.db.addUser(user);
  }

  update(id: string, user: User): User {
    return this.db.updateUser(id, user);
  }

  remove(id: string): void {
    return this.db.deleteUser(id);
  }
}
