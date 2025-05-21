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
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response,Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, 
    private readonly mailService: MailService, 
    private readonly jwtService: JwtService
  ) {}
  
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@NestRequest() req, @Res({ passthrough: true }) res: Response ) {
    const access_token = await this.authService.signToken(req.user);
    const refresh_token = await this.authService.signToken(req.user,'14d', process.env.JWT_REFRESH_KEY);
    this.authService.setCookie(res,'refresh_token', refresh_token, 14 * 24 * 60 * 60 * 1000);
    this.authService.setCookie(res, 'access_token', access_token, 30 * 60 * 1000);
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
  async signup(@Body() body: RegisterDTO, @Res({ passthrough: true }) res: Response) {
    const {name, email} = body;
    const user_id = await this.authService.signup(body);
    const mailoptions = {
      subject: 'Verification email',
      template: 'signup-confirmation-email',
      email,
      context: {name,verificationLink: `http://localhost:3000/auth/verifyUser?user_id=${user_id}`}
    }
    this.mailService.sendEmail(mailoptions);
    return {
      status: 'success',
      id: user_id
    };
  }

  @Get('resendEmail') 
  async resend(@Query('user_id') id:string) {
    await this.authService.resendEmail(id);
  }

  @Get('verifyUser') 
  async verifyUser(@Query('user_id') _id: string, @Res({ passthrough: true }) res: Response) {
    if (!_id) {
      throw new BadRequestException('Id is required');
    }
    const user = await this.authService.verifyUser(_id);
    const access_token = await this.authService.signToken(user);
    const refresh_token = await this.authService.signToken(user,'14d',process.env.JWT_REFRESH_KEY);
    this.authService.setCookie(res,'refresh_token', refresh_token, 14 * 24 * 60 * 60 * 1000);
    this.authService.setCookie(res, 'access_token', access_token, 30 * 60 * 1000);
    res.redirect('http://localhost:5173/successverifyemail');
  } 

  @Get('refresh')
  async checkAuthStatus(@NestRequest() req: Request, @Res({ passthrough: true }) res: Response  ) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_KEY,
      });
      const new_access_token = await this.authService.signToken(payload);
      this.authService.setCookie(res, 'access_token', new_access_token, 30 * 60 * 1000);
      return {
        status: 'success',
      }
    } catch {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }    
    
  }

  @UseGuards(JwtAuthGuard)
  @Get('/authorize')
  async GetUserAuthorized(@NestRequest() req: Request ) {
    return {
      status: "success",
      user: req.user
    }
  }
}
