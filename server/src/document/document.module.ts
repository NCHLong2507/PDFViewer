import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentSchema } from './document.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        {
          name: 'Document',
          schema: DocumentSchema
        },
      ]),],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService]
})
export class DocumentModule {}
