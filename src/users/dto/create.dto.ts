import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsNumber()
  age: number;
}
