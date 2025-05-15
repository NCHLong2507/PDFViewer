import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LoginDTO } from './DTO/LoginDTO'; // bạn cần chỉnh path cho đúng
import { AuthService } from './auth.service';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email, password } = request.body;

    if (!email || !password) {
      throw new BadRequestException('Invalid data')
    }
    const loginDto = plainToInstance(LoginDTO, { email, password });
    const errors = await validate(loginDto);
    if (errors.length > 0) {
      const messages = errors
    .map(err => Object.values(err.constraints || {}).join(', '))
    .join('; '); 
      throw new BadRequestException(messages);
    }

    const user = await this.authService.validateUser({ email, password });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    request.user = user;

    return true;
  }
}