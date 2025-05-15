import {
  Controller,
  Get,
  Req,
  Res,
  Body,
  Post,
  Query,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MailService } from 'src/mail/mail.service';
import { LoginDTO } from './DTO/LoginDTO';
import { RegisterDTO } from './DTO/RegisterDTO';
import { ResponseDTO } from '../ResponseDTO';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly mailService: MailService, private readonly userService: UserService ) {}
  @Post('login')
  async login(@Body() body: LoginDTO) {
    const result = await this.authService.login(body);
    return {
      status: 'success',
      user: result,
    };
  }

  @Post('signup')
  async signup(@Body() body: RegisterDTO) {
    const {name,password,email } = body;
    const verifyToken = await this.authService.signup(body);
    const mailoptions = {
      subject: 'Verification email',
      template: 'signup-confirmation-email',
      email,
      context: {name, verificationLink:`http://localhost:3000/auth/registerUser?verifyToken=${verifyToken}`}
    }
    this.mailService.sendEmail(mailoptions);
    return {
      status: 'success',
    };
  }

  @Get('registerUser') 
  async registerUserz(@Query('verifyToken') token: string) {
    const result = await this.authService.registerUser(token);
    return {
      status: 'success',
      user: result
    }
  } 

  
}
