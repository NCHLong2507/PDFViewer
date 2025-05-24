import { Exclude, Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class UserDTO {

  @Expose()
  @Transform(params => params.obj._id)
  _id: string
  
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  picture: string;
}