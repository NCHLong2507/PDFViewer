import { Expose, Exclude, Transform } from 'class-transformer';

export class DocumentDTO {
  @Expose()
  @Transform(params => params.obj._id)
  _id: string

  @Expose()
  @Transform(params => {
  const owner = params.obj.owner;
  if (typeof owner === 'string') {
    return owner; 
  } else if (owner && typeof owner === 'object' && 'name' in owner) {
    return { name: owner.name }; 
  }
  return owner; 
})
owner: { name: string } | string;


  @Expose()
  fileUrl: string

  @Expose()
  updatedAt: string

  @Exclude()
  collaborator

  @Exclude()
  createdAt: string
}