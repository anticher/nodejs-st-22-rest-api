import { IsArray, IsString } from 'class-validator';

export class UserGroupDto {
  @IsString()
  groupId: string;

  @IsArray()
  userIds: string[];
}
