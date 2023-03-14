import { UserDeletedDto } from './dtos/user-deleted.dto';
import { UserCreateDto } from './dtos/user-create.dto';
import { UserUpdateDto } from './dtos/user-update.dto';
import { UsersService } from './users.service';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { NotFoundException } from '@nestjs/common/exceptions';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { meSwagger } from './swagger/me.swagger';
import { UserSwagger } from './swagger/user.swagger';
import { UnauthorizedSwagger } from 'src/shared/swagger/unauthorized.swagger';
import { RequestErrorSwagger } from 'src/shared/swagger/request-error.swagger';
import { DeletedSwagger } from 'src/shared/swagger/deleted.swagger';

@ApiTags('usuarios')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Traz informações do usuário logado através do token JWT' })
  @ApiResponse({ status: 200, description: 'Info do usuário logado', type: meSwagger })
  @ApiResponse({ status: 401, description: 'Não Autorizado', type: UnauthorizedSwagger })
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Get(':userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Traz informações do usuário buscado' })
  @ApiResponse({ status: 200, description: 'Info do usuário buscado', type: UserSwagger })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado', type: RequestErrorSwagger })
  @ApiResponse({ status: 401, description: 'Não Autorizado', type: UnauthorizedSwagger })
  async getUser(@Param('userId') userId: string): Promise<User> {
    const result = await this.usersService.getUserByField({ _id: userId });
    if (!result) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return result;
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Traz lista de todos usuários cadastrados' })
  @ApiResponse({ status: 200, description: 'Info do usuário buscado', type: UserSwagger, isArray: true })
  @ApiResponse({ status: 401, description: 'Não Autorizado', type: UnauthorizedSwagger })
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @IsPublic()
  @Post()
  @ApiOperation({ summary: 'Cadastra novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário Criado', type: UserSwagger })
  @ApiResponse({ status: 400, description: 'Dado inválido', type: RequestErrorSwagger })
  async createUser(@Body() user: UserCreateDto): Promise<User> {
    return this.usersService.createUser(user);
  }

  @Patch(':userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza dados do usuário pelo id informado' })
  @ApiResponse({ status: 200, description: 'Info do usuário atualizado com sucesso', type: UserSwagger })
  @ApiResponse({ status: 401, description: 'Não Autorizado', type: UnauthorizedSwagger })
  async updateUser(@Param('userId') userId: string, @Body() userUpdateDto: UserUpdateDto): Promise<User> {
    const result = await this.usersService.updateUser(userId, userUpdateDto);
    if (!result) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return result;
  }

  @Delete(':userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deleta usuário pelo id informado' })
  @ApiResponse({ status: 200, description: 'Info do usuário deletada com sucesso', type: DeletedSwagger })
  @ApiResponse({ status: 401, description: 'Não Autorizado', type: UnauthorizedSwagger })
  async deleteUser(@Param('userId') userId: string): Promise<UserDeletedDto> {
    return await this.usersService.deleteUserById(userId);
  }
}
