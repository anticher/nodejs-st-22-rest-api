import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Group } from '../../groups/models/group.model';
import { User } from '../../users/models/user.model';

@Table
export class UserGroup extends Model {
  @ForeignKey(() => User)
  @Column
  userId: string;

  @ForeignKey(() => Group)
  @Column
  groupId: string;
}
