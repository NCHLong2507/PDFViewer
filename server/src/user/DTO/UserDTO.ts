import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UserDTO {

  @Expose()
  _id: string
  
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  @IsOptional()
  token: string;

  @Exclude()
  createdAt: string

  @Exclude()
  updatedAt: string
}