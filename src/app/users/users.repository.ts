import { UserDeletedDto } from './dtos/user-deleted.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(userFilterQuery: FilterQuery<User>): Promise<User> {
    return await this.userModel.findOne(userFilterQuery);
  }

  async find(usersFilterQuery: FilterQuery<User>): Promise<User[]> {
    return await this.userModel.find(usersFilterQuery);
  }

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async findOneAndUpdate(userFilterQuery: FilterQuery<User>, user: Partial<User>): Promise<User> {
    return await this.userModel.findOneAndUpdate(userFilterQuery, user);
  }

  async deleteById(userFilterQuery: FilterQuery<User>): Promise<UserDeletedDto> {
    return await this.userModel.deleteOne(userFilterQuery);
  }
}
