import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToClass, plainToInstance } from 'class-transformer';
import { LoginDTO } from 'src/auth/DTO/LoginDTO';
import { RegisterDTO } from 'src/auth/DTO/RegisterDTO';
import { UserDTO } from 'src/user/DTO/UserDTO';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as brypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async comparePassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(candidatePassword, userPassword);
    return isMatch;
  }

  async signToken(
    user: UserDTO,
    expiresIn = process.env.JWT_EXPIRED,
    secret = process.env.JWT_SECRET,
  ) {
    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture
    };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn,
      secret,
    });
    return access_token;
  }

  setCookie(res: Response, name: string, value: string, maxAge: number) {
    res.cookie(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // dùng true khi production
      sameSite: 'strict',
      maxAge,
    });
  }

  async signup(user: RegisterDTO): Promise<string> {
    const { name, email, password } = user;

    const existingUser = await this.userService.findbyEmail(email);
    if (existingUser !== null) {
      throw new ConflictException('User already exists');
    }
    const newUser = await this.userService.createUser(name, email, password);
    const userDTO = plainToInstance(UserDTO, newUser.toObject(), {
      excludeExtraneousValues: true,
    });
    return userDTO._id;
  }

  async resendEmail(_id: string) {
    const user = await this.userService.findById(_id, false);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isVerify) {
      throw new BadRequestException('Your account is already verified');
    }
    if (!user.email) {
      throw new BadRequestException('User email not found');
    }
    const mailoptions = {
      subject: 'Verification email',
      template: 'signup-confirmation-email',
      email: user.email,
      context: {
        name: user?.name,
        verificationLink: `http://localhost:3000/auth/verifyUser?user_id=${user?._id}`,
      },
    };
    this.mailService.sendEmail(mailoptions);
  }

  async verifyUser(_id: string): Promise<UserDTO> {
    if (!_id) {
      throw new BadRequestException('User ID is required');
    }
    const newUser = await this.userService.updateUser(_id, { isVerify: true });
    const userDTO = plainToInstance(UserDTO, newUser.toObject(), {
      excludeExtraneousValues: true,
    });
    return userDTO;
  }

  async validateUser(body: LoginDTO): Promise<UserDTO> {
    const { email, password } = body;
    const foundUser = await this.userService.findbyEmail(email);
    if (foundUser) {
      const isPasswordValid = await this.comparePassword(
        password,
        foundUser.password,
      );
      if (isPasswordValid) {
        const userDTO = plainToInstance(UserDTO, foundUser.toObject(), {
          excludeExtraneousValues: true,
        });
        return userDTO;
      } else {
        throw new UnauthorizedException('Invalid password');
      }
    }
    throw new NotFoundException('User not found!');
  }

  async GoogleSignup(access_token: string): Promise<UserDTO> {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${access_token}`,
    );
    if (!response.ok) {
      throw new BadRequestException(
        `HTTP error! status: ${response.status} - ${response.statusText}`,
      );
    }
    const tokeninfo = await response.json();
    if (tokeninfo.aud !== process.env.GOOGLE_CLIENT_ID) {
      throw new UnauthorizedException('Unauthorized: Invalid token audience.');
    }
    const currentTimeInSeconds = Date.now() / 1000;
    if (tokeninfo.exp < currentTimeInSeconds) {
      throw new UnauthorizedException(
        'Unauthorized: Access token has expired.',
      );
    }
    const userinfoResponse = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    if (!userinfoResponse.ok) {
      throw new BadRequestException(
        `HTTP error fetching user info! Status: ${userinfoResponse.status} - ${userinfoResponse.statusText}`,
      );
    }
    const user = await userinfoResponse.json();
    const { name, email, sub, picture } = user;
    const existingUser = await this.userService.findbyEmail(email);
    if (existingUser) {
      throw new ConflictException('This email address is currently being used with email & password.Please sign in with email & password.')
    }
    const newUser = await this.userService.createGoogleAccount(
      name,
      email,
      sub,
      picture,
    );
    const userDTO = plainToInstance(UserDTO, newUser, {
      excludeExtraneousValues: true,
    });
    return userDTO;
  }
  async GoogleLogin(access_token: string): Promise<UserDTO | null> {
    if (!access_token) {
      throw new BadRequestException('Access token is required.');
    }
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${access_token}`,
    );
    if (!response.ok) {
      throw new BadRequestException(
        `HTTP error! status: ${response.status} - ${response.statusText}`,
      );
    }
    const tokeninfo = await response.json();
    if (tokeninfo.aud !== process.env.GOOGLE_CLIENT_ID) {
      throw new UnauthorizedException('Unauthorized: Invalid token audience.');
    }
    const currentTimeInSeconds = Date.now() / 1000;
    if (tokeninfo.exp < currentTimeInSeconds) {
      throw new UnauthorizedException(
        'Unauthorized: Access token has expired.',
      );
    }
    const userinfoResponse = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    if (!userinfoResponse.ok) {
      throw new BadRequestException(
        `HTTP error fetching user info! Status: ${userinfoResponse.status} - ${userinfoResponse.statusText}`,
      );
    }
    const user = await userinfoResponse.json();
    const subject = user.sub;
    const existingUser = await this.userService.findBySubject(subject); 
    if (existingUser) {
      const userDTO = plainToInstance(UserDTO,existingUser,{excludeExtraneousValues:true});
      return userDTO;
    }
    return null;
  }
}
