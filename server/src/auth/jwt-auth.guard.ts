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
    const token = req.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Access token not found');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      req.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Access token expired or invalid');
    }
  }
}
