import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  @IsString({message:'Password is a string'})
  password: string;

}