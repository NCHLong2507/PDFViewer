import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({minlength: 8 })
  @IsOptional()
  password: string;

  @Prop({ required: true})
  name:string

  @Prop({required: true, default: false})
  isVerify: boolean
  
  @Prop()
  @IsOptional()
  subject: string

  @Prop()
  @IsOptional()
  picture: string

}

export const UserSchema = SchemaFactory.createForClass(User);
