import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Document } from './document.schema';
import { Type } from '@nestjs/common';
export type DocDocumentPermission  = HydratedDocument<Document>;

export enum CollaboratorRole {
  VIEWER = 'Viewer',
  EDITOR = 'Editor',
}

@Schema({ timestamps: true })
export class DocumentPermission {
  @Prop({ type: Types.ObjectId,ref: 'User', required: true })
  user: Types.ObjectId

  @Prop({type: Types.ObjectId, ref: 'Document', required: true})
  document: Types.ObjectId

  @Prop({type: String, enum: Object.values(CollaboratorRole)})
  role: string
}

export const DocumentPermissionSchema = SchemaFactory.createForClass(DocumentPermission);
