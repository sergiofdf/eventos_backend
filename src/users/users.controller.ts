import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { UserDeletedDto } from './dtos/user-deleted.dto';
import { UserCreateDto } from './dtos/user-create.dto';
import { UserUpdateDto } from './dtos/user-update.dto';
import { UsersService } from './users.service';
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { NotFoundException } from '@nestjs/common/exceptions';
import { AuthGuard } from '@nestjs/passport';

@Controller('/users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  async getUser(@Param('userId') userId: string): Promise<User> {
    const result = await this.usersService.getUserById(userId);
    if (!result) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return result;
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Post()
  async createUser(@Body() user: UserCreateDto): Promise<User> {
    return this.usersService.createUser(user);
  }

  @Patch(':userId')
  async updateUser(@Param('userId') userId: string, @Body() userUpdateDto: UserUpdateDto): Promise<User> {
    const result = await this.usersService.updateUser(userId, userUpdateDto);
    if (!result) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return result;
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string): Promise<UserDeletedDto> {
    return await this.usersService.deleteUserById(userId);
  }
}
