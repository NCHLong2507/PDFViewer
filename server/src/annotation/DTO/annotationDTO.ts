import { Expose, Transform, Type } from 'class-transformer';

export class AnnotationDTO {
  @Expose()
  annotID: string

  @Expose()
  xfdf: string
}