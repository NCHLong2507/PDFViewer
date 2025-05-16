import { Expose, Exclude } from 'class-transformer';

export class DocumentDTO {
  @Expose()
  _id: string

  @Expose()
  owner: {
    name: string
  }

  @Expose()
  fileUrl: string

  @Expose()
  updatedAt: string

  @Exclude()
  collaborator

  @Exclude()
  createdAt: string
}