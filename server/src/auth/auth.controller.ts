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
  async login(@NestRequest() req, @Res({ passthrough: true }) res: Response ) {
    const access_token = await this.authService.signToken(req.user);
    const refresh_token = await this.authService.signToken(req.user,'14d', process.env.JWT_REFRESH_KEY);
    res.cookie('refresh_token',refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 14*24*60*60*1000
    });
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 30*60*1000
    });
    return {
      status: 'success',
      user: req.user,
    };
  }

  @Post('logout')
  async logout(@NestRequest() req, @Res({passthrough:true}) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return {
      status: 'success'
    }
  }
  
  @Post('signup')
  async signup(@Body() body: RegisterDTO | undefined,@NestRequest() req: Request, @Res({ passthrough: true }) res: Response) {
    let name:string, email:string, password: string;
    if (body === undefined) {
      const token = req.cookies['refresh_token'];
      if (!token) {
        throw new BadRequestException('Missing token');
      }
      const payload = this.jwtService.verify(token,{secret:process.env.JWT_REFRESH_KEY}); 
      ({ name, password, email } = payload);
    }
    else {
      ({name,password,email} = body);
    }
    const data: RegisterDTO = {name,password,email}
    const {access_token, refresh_token} = await this.authService.signup(data);
    const mailoptions = {
      subject: 'Verification email',
      template: 'signup-confirmation-email',
      email,
      context: {name,verificationLink: `http://localhost:3000/auth/registerUser?access_token=${access_token}`}
    }
    this.mailService.sendEmail(mailoptions);
    res.cookie('refresh_token',refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 14*24*60*60*1000
    });
    return {
      status: 'success',
    };
  }

  @Get('registerUser') 
  async registerUserz(@Query('access_token') access_token: string, @NestRequest() req: Request, @Res({ passthrough: true }) res: Response) {
    if (!access_token) {
      throw new UnauthorizedException('Access denied: No verification token found');
    }
    await this.authService.registerUser(access_token);
    res.cookie('access_token',access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 30*60*1000
    });
    res.redirect('http://localhost:5173/successverifyemail');
  } 

  @UseGuards(JwtAuthGuard)
  @Get('authorize')
  checkAuthStatus(@NestRequest() req: Request) {
    return {
      status: 'success',
      user: req.user
    }
  }
}
