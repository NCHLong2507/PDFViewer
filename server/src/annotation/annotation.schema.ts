import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Document } from '../document/schema/document.schema';
export type AnnotationDocument  = HydratedDocument<Annotation>;


@Schema({ timestamps: true })
export class Annotation {
  @Prop({ type: Types.ObjectId,ref: 'Document', required: true })
  document: Types.ObjectId

  @Prop({required:true})
  annotID: string

  @Prop({required:true})
  xfdf: string
}

export const AnnotationSchema = SchemaFactory.createForClass(Annotation);
