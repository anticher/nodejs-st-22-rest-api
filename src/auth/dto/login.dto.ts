import { IsDefined, IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsDefined()
  @IsString()
  @IsString()
  @Matches(/(?=.*\d)((?=.*[A-z])|(?=.*[a-z])).*/, {
    message: 'password is too weak',
  })
  password: string;
}
