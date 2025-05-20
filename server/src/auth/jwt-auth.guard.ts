import { 
  CanActivate, 
  ExecutionContext, 
  Injectable, 
  UnauthorizedException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const token = req.cookies?.access_token ;
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      req.user = payload;
      return true;
    } catch (err) {
      const refreshToken = req.cookies?.refresh_token;

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      try {
        const refreshPayload = this.jwtService.verify(refreshToken, {
          secret: process.env.JWT_REFRESH_KEY,
        });

        const newAccessToken = this.jwtService.sign(
          { _id: refreshPayload._id, name: refreshPayload.name, email: refreshPayload.email },
          { secret: process.env.JWT_SECRET, expiresIn: '30m' },
        );

        res.cookie('access_token', newAccessToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: 30 * 60 * 1000,
        });

        req.user = refreshPayload;

        return true;
      } catch (refreshErr) {
        throw new UnauthorizedException('Refresh token expired or invalid');
      }
    }
  }
}
