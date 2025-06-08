import { Module } from '@nestjs/common';
import { AnnotationController } from './annotation.controller';
import { AnnotationService } from './annotation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnotationSchema } from './annotation.schema';
import { DocumentSchema } from '../document/schema/document.schema';
import { DocumentModule } from 'src/document/document.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Annotation',
        schema: AnnotationSchema,
      },
      {
        name: 'Document',
        schema: DocumentSchema
      }
    ]),
    DocumentModule
  ],
  controllers: [AnnotationController],
  providers: [AnnotationService],
})
export class AnnotationModule {}
