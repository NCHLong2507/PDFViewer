import { IsString, IsEmail, MinLength, } from 'class-validator';

export class LoginDTO {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password is too short. Minimum length is 8 characters.' })
  password: string;
}