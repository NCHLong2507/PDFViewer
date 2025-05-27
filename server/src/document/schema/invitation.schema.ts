import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Document } from './document.schema';
import { CollaboratorRole } from './document_permission.schema';
export type InvitationDocument  = HydratedDocument<Invitation>;


@Schema({ timestamps: true })
export class Invitation {
  @Prop({ type: Types.ObjectId,ref: 'Document', required: true })
  document: Types.ObjectId

  @Prop({required:true})
  email: string

  @Prop({type: String, enum: Object.values(CollaboratorRole)})
  role: string

  @Prop({default:'pending'})
  status: string
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);