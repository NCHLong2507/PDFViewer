import { Injectable, BadRequestException, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToClass, plainToInstance } from 'class-transformer';
import { LoginDTO } from 'src/auth/DTO/LoginDTO';
import { RegisterDTO } from 'src/auth/DTO/RegisterDTO';
import { UserDTO } from 'src/user/DTO/UserDTO';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as brypt from 'bcrypt';

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

  async signToken(user:UserDTO, expiresIn = process.env.JWT_EXPIRED, secret = process.env.JWT_SECRET) {
    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
    const access_token = await this.jwtService.signAsync(payload,{
      expiresIn,
      secret
    });
    return access_token;
  }



  async signup(user: RegisterDTO): Promise<{access_token: string, refresh_token: string}> {
    const { name, email, password } = user;

    const existingUser = await this.userService.findbyEmail(email, false);
    if (existingUser !== null) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12); 

    const access_token = await this.jwtService.signAsync({name,email,password: hashedPassword},{
      expiresIn: '30m',
      secret: process.env.JWT_SECRET
    });

    const refresh_token = await this.jwtService.signAsync({name,email,password: hashedPassword}, {
      expiresIn: '14d',
      secret: process.env.JWT_REFRESH_KEY
    })
    return {
      access_token,
      refresh_token
    }
  } 

  async registerUser(token: string): Promise<UserDTO> {
    let payload: {
      name: string,
      email: string,
      password: string
    };
    try {
      payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_VERIFY_KEY,
    });
    } catch (error) {
      throw new BadRequestException('Invalid email request');
    }

    const { name, email, password } = payload;
    
    const newUser = await this.userService.createUser(name, email, password,true);
    const userDTO = plainToInstance(UserDTO, newUser.toObject(),{excludeExtraneousValues: true});
    return userDTO;
  }

  async validateUser(body: LoginDTO): Promise<UserDTO> {
    const { email, password } = body;
    const foundUser = await this.userService.findbyEmail(email);
    if (foundUser) {
      const isPasswordValid = await this.comparePassword(password,foundUser.password);
      if (isPasswordValid) {
        const userDTO = plainToInstance(UserDTO,foundUser.toObject(),{excludeExtraneousValues:true});
        return userDTO;
      } else {
        throw new UnauthorizedException('Invalid password');
      }
    }
    throw new NotFoundException('User not found!');
  }
}
