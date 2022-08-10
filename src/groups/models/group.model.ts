import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserGroup } from 'src/groups/models/user-group.model';
import { User } from 'src/users/models/user.model';
import { Permission } from './group-permission.model';

@Table
export class Group extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;
  @BelongsToMany(() => User, () => UserGroup)
  groupId: UserGroup;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  permissions: Permission[];

  @BelongsToMany(() => User, () => UserGroup)
  users: User[];
}
