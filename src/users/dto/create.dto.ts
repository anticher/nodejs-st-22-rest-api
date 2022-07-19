import { IsNumber, IsString, Matches, Max, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  @Matches(/(?=.*\d)((?=.*[A-z])|(?=.*[a-z])).*/, {
    message: 'password is too weak',
  })
  password: string;

  @IsNumber()
  @Min(5)
  @Max(129)
  age: number;
}
