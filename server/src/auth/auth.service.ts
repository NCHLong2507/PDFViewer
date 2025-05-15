import { Model } from 'mongoose';
import { Injectable, HttpStatus, BadRequestException, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/auth/DTO/LoginDTO';
import { RegisterDTO } from 'src/auth/DTO/RegisterDTO';
import { UserDTO } from 'src/user/DTO/UserDTO';
import { ResponseDTO } from 'src/ResponseDTO';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService

  ) {}

  async comparePassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(candidatePassword, userPassword);
    return isMatch;
  }

  async signToken(user:UserDTO, expiresIn = process.env.JWT_EXPIRED) {
    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
    const access_token = await this.jwtService.signAsync(payload,{
      expiresIn,
      secret: process.env.JWT_SECRET
    });
    return access_token;
  }

  async login(
    user: LoginDTO,
  ): Promise<UserDTO> {
    const { email, password } = user;
    if (!email || !password) {
      throw new BadRequestException('Email and Password is required');
    }
    const foundUser = await this.userService.findbyEmail(email);
    if (foundUser === null) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await this.comparePassword(
      password,
      foundUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    foundUser.token = await this.signToken(foundUser); 
    return foundUser;
  }

  async signup(user: RegisterDTO): Promise<string> {
    const { name, email, password } = user;

    const existingUser = await this.userService.findbyEmail(email, false);
    if (existingUser instanceof UserDTO) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12); 

    const token = await this.jwtService.signAsync({name,email,password: hashedPassword},{
      expiresIn: '1h',
      secret: process.env.JWT_VERIFY_KEY
    });
    return token;
  } 

  async registerUser(token: string): Promise<UserDTO> {
    try {
      const payload = await this.jwtService.verifyAsync(token,{
        secret: process.env.JWT_VERIFY_KEY
      });

      const { name, email, password } = payload;

      const existingUser = await this.userService.findbyEmail(email, false);
      if (existingUser) {
        throw new ConflictException('User already exists');
      }
      const newUser = await this.userService.createUser(name, email, password,true);
      newUser.token = await this.signToken(newUser);
      return newUser;
    } catch (err) {
      console.log(err)
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
  
}
