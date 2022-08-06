import { Permission } from './group-permission.model';

export interface GroupResponse {
  id: string;
  name: string;
  permissions: Permission[];
}
