import { Injectable } from '@nestjs/common';
import User, { UserDocument } from '@models/user';
import CreateUserDto from '@dto/user/create-user-dto';
import UpdateUserDto from '@dto/user/update-user-dto';
import { Model, Types } from 'mongoose';
import IUserRepository from '@repositories/user/IUserRepositories';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MongoRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: CreateUserDto): Promise<User> {
    const userCreated = await this.userModel.create({
      ...user,
      _id: `${new Types.ObjectId()}`,
    });

    return userCreated;
  }

  async update(userId: string, data: UpdateUserDto): Promise<User> {
    const userUpdated = await this.userModel.findOneAndUpdate(
      { _id: userId },
      data,
      {
        new: true,
      },
    );

    return userUpdated;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    return user;
  }
}
