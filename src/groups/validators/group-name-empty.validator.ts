import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { GroupService } from '../services/group.service';
@ValidatorConstraint({ name: 'IsNameUnique' })
@Injectable()
export class IsNameUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly groupService: GroupService) {}

  public async validate(name: string): Promise<boolean> {
    return !(await this.groupService.getOneByName(name));
  }

  defaultMessage() {
    return 'group ($value) is already registered';
  }
}

export function IsNameUnique(
  validationOptions?: ValidationOptions,
): (object: any, propertyName: string) => void {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsNameUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNameUniqueConstraint,
    });
  };
}
