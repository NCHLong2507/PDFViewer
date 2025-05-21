import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 8 })
  password: string;
  @Prop()
  name:string
  @Prop({required: true, default: false})
  isVerify: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);
