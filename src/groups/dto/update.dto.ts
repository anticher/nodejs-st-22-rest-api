import { IsEnum, IsString } from 'class-validator';
import { PermissionEnum } from '../enums/group-permission.enum';
import { Permission } from '../models/group-permission.model';

export class UpdateGroupDto {
  @IsString()
  name: string;

  @IsEnum(PermissionEnum, { each: true })
  permissions: Permission[];
}
