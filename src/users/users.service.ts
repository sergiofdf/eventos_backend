import { randomUUID } from 'crypto';
import { UserCreateDto } from './dtos/user-create.dto';
import { UserUpdateDto } from './dtos/user-update.dto';
import { UsersRepository } from './users.repository';
import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UserDeletedDto } from './dtos/user-deleted.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(_id: string): Promise<User> {
    return await this.usersRepository.findOne({ _id });
  }

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.find({});
  }

  async createUser(user: UserCreateDto): Promise<User> {
    const userEntity = new User({
      _id: randomUUID(),
      ...user,
    });
    return await this.usersRepository.create(userEntity);
  }

  async updateUser(_id: string, userUpdates: UserUpdateDto): Promise<User> {
    const update = await this.usersRepository.findOneAndUpdate({ _id }, userUpdates);
    if (update) return await this.usersRepository.findOne({ _id });
    return null;
  }

  async deleteUserById(_id: string): Promise<UserDeletedDto> {
    return await this.usersRepository.deleteById({ _id });
  }
}
