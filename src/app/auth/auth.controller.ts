import { AuthService } from './auth.service';
import { Controller, Post, Req, HttpStatus, HttpCode } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from './models/auth-request.model';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginReturnSwagger } from './swagger/login-return.swagger';
import { LoginBodySwagger } from './swagger/login-body.swagger';
@ApiTags('login')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Cria token de acesso para usuário informado' })
  @ApiBody({ required: true, type: LoginBodySwagger })
  @ApiResponse({ status: 200, description: 'Token do usuário logado', type: LoginReturnSwagger })
  @ApiResponse({ status: 500, description: 'Não foi possível gerar o token' })
  async login(@Req() req: any) {
    return await this.authService.login(req.user);
  }
}
