import { AuthService } from './auth.service';
import { Controller, Post, Req, HttpStatus, HttpCode } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from './models/auth-request.model';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: AuthRequest) {
    return await this.authService.login(req.user);
  }
}
