import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  login: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsNumber()
  age: number;
}
