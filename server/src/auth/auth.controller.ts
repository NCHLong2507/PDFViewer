import {
  Controller,
  Get,
  Request,
  Body,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MailService } from 'src/mail/mail.service';
import { RegisterDTO } from './DTO/RegisterDTO';
import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly mailService: MailService, private readonly userService: UserService ) {}
  
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const token = await this.authService.signToken(req.user);
    req.user.token = token;
    return {
      status: 'success',
      user: req.user,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
