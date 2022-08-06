import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Permission } from './group-permission.model';

@Table
export class Group extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

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
}
