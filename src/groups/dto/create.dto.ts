import { IsEnum, IsString } from 'class-validator';
import { PermissionEnum } from '../enums/group-permission.enum';
import { Permission } from '../models/group-permission.model';
import { IsNameUnique } from '../validators/group-name-empty.validator';

export class CreateGroupDto {
  @IsString()
  @IsNameUnique()
  name: string;

  @IsEnum(PermissionEnum, { each: true })
  permissions: Permission[];
}
