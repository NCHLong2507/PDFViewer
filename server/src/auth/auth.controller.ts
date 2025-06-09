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
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MailService } from 'src/mail/mail.service';
import { RegisterDTO } from './DTO/RegisterDTO';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { DocumentService } from 'src/document/document.service';
import { boolean } from 'yargs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly documentService: DocumentService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@NestRequest() req, @Res({ passthrough: true }) res: Response) {
    const access_token = await this.authService.signToken(req.user);
    const refresh_token = await this.authService.signToken(
      req.user,
      '14d',
      process.env.JWT_REFRESH_KEY,
    );
    this.authService.setCookie(
      res,
      'refresh_token',
      refresh_token,
      14 * 24 * 60 * 60 * 1000,
    );
    this.authService.setCookie(
      res,
      'access_token',
      access_token,
      30 * 60 * 1000,
    );
    return {
      status: 'success',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@NestRequest() req, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return {
      status: 'success',
    };
  }

  @Post('signup')
  async signup(
    @Body() body: RegisterDTO,
    @Res({ passthrough: true }) res: Response,
    @Query('invitation_token') invitation_token: string,
  ) {
    const { name, email } = body;
    const user_id = await this.authService.signup(body, invitation_token);
    const verify_token = await this.jwtService.signAsync(
      {},
      { secret: process.env.JWT_VERIFICATION_KEY, expiresIn: '24h' },
    );
    const verificationLink = invitation_token
      ? `http://localhost:3000/auth/verifyUser?user_id=${user_id}&verify_token=${verify_token}&invitation_token=${invitation_token}`
      : `http://localhost:3000/auth/verifyUser?user_id=${user_id}&verify_token=${verify_token}`;
    const mailoptions = {
      subject: 'Verification email',
      template: 'signup-confirmation-email',
      email,
      context: {
        name,
        verificationLink,
      },
    };
    this.mailService.sendEmail(mailoptions);
    return {
      status: 'success',
      id: user_id,
    };
  }

  @Get('resendEmail')
  async resend(@Query('user_id') id: string) {
    await this.authService.resendEmail(id);
  }

  @Get('verifyUser')
  async verifyUser(
    @Query('user_id') _id: string,
    @Query('verify_token') verify_token: string,
    @Query('invitation_token') invitation_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!_id) {
      throw new BadRequestException('Id is required');
    }
    try {
      if (verify_token) {
        await this.jwtService.verifyAsync(verify_token, {
          secret: process.env.JWT_VERIFICATION_KEY,
        });
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.redirect(
          `http://localhost:5173/invalidVerifyToken?user_id=${_id}`,
        );
      }
      throw new BadRequestException('Invalid token');
    }

    const user = await this.authService.verifyUser(_id);
    if (typeof user === 'boolean') {
      return res.redirect(`http://localhost:5173/document/documentlist`);
    }
    const access_token = await this.authService.signToken(user);
    const refresh_token = await this.authService.signToken(
      user,
      '14d',
      process.env.JWT_REFRESH_KEY,
    );
    this.authService.setCookie(
      res,
      'refresh_token',
      refresh_token,
      14 * 24 * 60 * 60 * 1000,
    );
    this.authService.setCookie(
      res,
      'access_token',
      access_token,
      30 * 60 * 1000,
    );
    if (invitation_token) {
      const result =
        await this.documentService.verifyInvitationToken(invitation_token);
      if (result && result.status) {
        return res.redirect(
          `http://localhost:5173/document/documentdetailed?id=${result.documentID}`,
        );
      } else if (result && !result.status) {
        return res.redirect(`http://localhost:5173/invalidToken`);
      }
    }
    const directURL = 'http://localhost:5173/successverifyemail';
    return res.redirect(directURL);
  }

  @Get('refresh')
  async checkAuthStatus(
    @NestRequest() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_KEY,
      });
      const new_access_token = await this.authService.signToken(payload);
      this.authService.setCookie(
        res,
        'access_token',
        new_access_token,
        30 * 60 * 1000,
      );
      return {
        status: 'success',
      };
    } catch {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/authorize')
  async GetUserAuthorized(
    @NestRequest() req: Request,
    @Query('invitation_token') invitation_token: string,
  ) {
    let directURL = '';
    if (invitation_token) {
      const result =
        await this.documentService.verifyInvitationToken(invitation_token);
      if (result && result.status) {
        directURL = `/document/documentdetailed?id=${result.documentID}`;
      } else if (result && !result.status) {
        directURL = `/invalidToken`;
      }
    }
    return {
      status: 'success',
      user: req.user,
      directURL,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/permission')
  async GetPermission(@NestRequest() req: Request, @Query('id') id: string) {
    const cur_user = req.user as { email: string; _id: string; name: string };
    if (!cur_user || !cur_user.email) {
      throw new BadRequestException('Mising data');
    }
    const actions = await this.documentService.getDocumentPermissionPerUser(
      id,
      cur_user.email,
    );
    return {
      status: 'success',
      actions,
    };
  }

  @Get('/google/authentication')
  async GoogleAuthentication(
    @NestRequest() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('invitation_token') invitation_token: string,
  ) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Missing headers');
    }
    const gg_access_token = authHeader.split(' ')[1];
    let result: {
      status: boolean;
      documentID?: string;
      documentName?: string;
      email?: string;
    } | null = null;

    const emailChecked = null;
    let user = await this.authService.GoogleLogin(
      gg_access_token,
      emailChecked,
    );
    if (!user) {
      user = await this.authService.GoogleSignup(gg_access_token, emailChecked);
    }
    if (invitation_token) {
      result = await this.documentService.verifyInvitationToken(
        invitation_token,
        user.email,
      );
    }
    const access_token = await this.authService.signToken(user);
    const refresh_token = await this.authService.signToken(
      user,
      '14d',
      process.env.JWT_REFRESH_KEY,
    );
    this.authService.setCookie(
      res,
      'refresh_token',
      refresh_token,
      14 * 24 * 60 * 60 * 1000,
    );
    this.authService.setCookie(
      res,
      'access_token',
      access_token,
      30 * 60 * 1000,
    );
    const retData = {
      status: 'success',
      user,
      directURL: '',
    };

    if (result && result.status) {
      retData.directURL = `/document/documentdetailed?id=${result.documentID}`;
    } else if (result && !result.status) {
      retData.directURL = `/invalidToken`;
    }
    return retData;
  }
}
