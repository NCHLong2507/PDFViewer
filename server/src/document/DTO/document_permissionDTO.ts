import { Expose, Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class DocumentPermissionDTO {

  @Expose()
  @Transform(({ obj }) => {
    const user = obj.user;
    return {_id:user._id, name: user.name, email: user.email };
  })
  user: {_id: ObjectId; name: string; email: string };

  @Expose()
  @Transform(({value})=> value.toString())
  role: string
}