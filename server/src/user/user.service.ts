import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { User } from '../user/user.schema';
import {Model,Types} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../user/user.schema';
@Injectable()
export class UserService {
  constructor (
    @InjectModel('User')
    private userModel: Model<User>
  ) {}

  async findbyEmail(email: string, isVerify:boolean = true): Promise<UserDocument | null> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    const user = await this.userModel.findOne({ email, isVerify });
    return user;
  }
  async findById(_id: string, isVerify: boolean = true): Promise<UserDocument | null> {
    if (!_id) {
      throw new BadRequestException('ID is required');
    }

    const objectId = new Types.ObjectId(_id);

    const user = await this.userModel.findOne({ _id: objectId, isVerify });
    return user;
  }

  async updateUser(id: string, updates: Partial<UserDocument>): Promise<UserDocument> {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new BadRequestException('No fields provided for update');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(id, updates, {
      new: true,             
      runValidators: true,   
    });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async createUser(name: string, email: string, password: string): Promise<UserDocument> {
    if (!name || !email || !password) {
      throw new BadRequestException('Name, email and password are required');
    }
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    password = await bcrypt.hash(password,12);
    const newUser = await this.userModel.create({ name, email, password });
    return newUser;
  }
}
