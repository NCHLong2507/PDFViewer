import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { UserDTO } from './DTO/UserDTO';
import { User } from '../user/user.schema';
import {Model} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor (
    @InjectModel('User')
    private userModel: Model<User>
  ) {}

  async findbyEmail(email: string, throwIfNotFound = true): Promise<UserDTO | null> {
  if (!email) {
    throw new BadRequestException('Email is required');
  }

  const user = await this.userModel.findOne({ email });
  
  if (!user) {
    if (throwIfNotFound) {
      throw new NotFoundException('User not found');
    } else {
      return null; 
    }
  }
  const userDTO = plainToClass(UserDTO, user.toObject());
  return userDTO;
}

  async createUser(name: string, email: string, password: string, ishashedPassword = false): Promise<UserDTO> {
    if (!name || !email || !password) {
      throw new BadRequestException('Name, email and password are required');
    }
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    if (!ishashedPassword) {
      password = await bcrypt.hash(password,12);
    }
    const newUser = await this.userModel.create({ name, email, password });
    const userDTO = plainToClass(UserDTO, newUser.toObject());
    return userDTO;
  }
}
