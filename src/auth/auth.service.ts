import { Injectable } from '@nestjs/common';
import { User } from 'src/users/models/user.model';
import { UserRepositoryService } from 'src/users/repository/users-repository.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userRepositoryService: UserRepositoryService,
    private jwtService: JwtService,
  ) {}

  public async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string } | string> {
    const user = await this.userRepositoryService.getOneByName(
      loginDto.username,
    );
    if (typeof user === 'string' || user.password !== loginDto.password) {
      return 'no user with such login or password does not match actual one';
    }
    return this.getToken(user);
  }

  private getToken(user: User): { accessToken: string } {
    const payload = { username: user.login, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      }),
    };
  }
}
