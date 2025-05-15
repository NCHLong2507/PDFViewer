import { IsString, IsEmail, MinLength, IsNotEmpty, } from 'class-validator';

export class RegisterDTO {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password is too short. Minimum length is 8 characters.' })
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;
  
}