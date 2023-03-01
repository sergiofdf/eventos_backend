import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async login(user) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);

    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) return null;

    return user;
  }
}
