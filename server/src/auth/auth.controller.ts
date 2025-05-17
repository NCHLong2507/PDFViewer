import {
  Controller,
  Get,
  Res,
  Request as NestRequest,
  Body,
  Post,
  Query,
  UseGuards,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MailService } from 'src/mail/mail.service';
import { RegisterDTO } from './DTO/RegisterDTO';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response,Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, 
    private readonly mailService: MailService, 
    private readonly userService: UserService,
    private readonly jwtService: JwtService 
  ) {}
  
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@NestRequest() req ) {
    const token = await this.authService.signToken(req.user);
    req.user.token = token;
    return {
      status: 'success',
      user: req.user,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@NestRequest() req) {
    req.logout();
    return {
      status: 'success'
    }
  }
  
  @Post('signup')
  async signup(@Body() body: RegisterDTO | undefined,@NestRequest() req: Request, @Res({ passthrough: true }) res: Response) {
    let name:string, email:string, password: string;
    if (body === undefined) {
      const token = req.cookies['verifyToken'];
      if (!token) {
        throw new BadRequestException('Missing token');
      }
      const payload = this.jwtService.verify(token,{secret:process.env.JWT_VERIFY_KEY}); 
      ({ name, password, email } = payload);
    }
    else {
      ({name,password,email} = body);
    }
    const data: RegisterDTO = {name,password,email}
    const verifyToken = await this.authService.signup(data);
    const mailoptions = {
      subject: 'Verification email',
      template: 'signup-confirmation-email',
      email,
      context: {name, verificationLink:`http://localhost:5173/successverifyemail`}
    }
    this.mailService.sendEmail(mailoptions);
    res.cookie('verifyToken',verifyToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 36600000
    });
    return {
      status: 'success',
    };
  }

  @Get('registerUser') 
  async registerUserz(@NestRequest() req: Request) {
    const token = req.cookies['verifyToken'];
    if (!token) {
      throw new UnauthorizedException('Access denied: No verification token found');
    }
    const result = await this.authService.registerUser(token);
    return {
      status: 'success',
      user: result
    }
  } 

  @UseGuards(JwtAuthGuard)
  @Get('authorize')
  checkAuthStatus(@NestRequest() req) {
    return {
      status: 'success',
    }
  }
}
