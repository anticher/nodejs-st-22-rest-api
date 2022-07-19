import { IsNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsNumber()
  age: number;
}
