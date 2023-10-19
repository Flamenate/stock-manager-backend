import { Model, ObjectId } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      $or: [{ email: createUserDto.email, phone: createUserDto.phone }],
    });
    if (user)
      throw new BadRequestException(
        'User with that email or phone already exists.',
      );

    const createdUser = new this.userModel({
      ...createUserDto,
      password_hash: await bcrypt.hash(createUserDto.password, 10),
    }).save();
    return createdUser;
  }

  async findManyByIds(ids: (string | ObjectId)[]): Promise<User[]> {
    return [
      ...(await this.userModel.find(
        { _id: { $in: ids } },
        { password_hash: 0 },
      )),
    ];
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }
}
