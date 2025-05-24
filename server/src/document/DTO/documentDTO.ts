import { Expose, Transform, Type } from 'class-transformer';

export class DocumentDTO {
  @Expose()
  @Transform(({ obj }) => obj._id.toString()) 
  _id: string;

  @Expose()
  @Transform(({ obj }) => {
    const owner = obj.owner;
    if (typeof owner === 'string') {
      return owner;
    } else if (owner && typeof owner === 'object' && 'name' in owner && 'email' in owner) {
      return { name: owner.name, email: owner.email, picture: owner.picture };
    }
    return owner;
  })
  owner: { name: string; email: string, picture: string } | string;

  @Expose()
  name: string;

  @Expose()
  fileUrl: string;

  @Expose()
  updatedAt: string;
}