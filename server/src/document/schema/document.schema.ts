import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/user.schema';
export type DocumentDocument  = HydratedDocument<Document>;


@Schema({ timestamps: true })
export class Document {
  @Prop({ type: Types.ObjectId,ref: 'User', required: true })
  owner: Types.ObjectId

  @Prop({required:true})
  fileUrl: string

  @Prop({required:true})
  name:string
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
