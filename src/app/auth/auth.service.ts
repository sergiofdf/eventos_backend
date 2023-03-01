import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/app/users/schemas/user.schema';
import { UserPayload } from './models/user-payload.model';
import { UserJwtToken } from './models/user-jwt-token.model';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async login(user: User): Promise<UserJwtToken> {
    const payload: UserPayload = {
      sub: user._id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);

    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) return null;

    return user;
  }
}
