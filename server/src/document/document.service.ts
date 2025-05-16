import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Document,DocumentDocument } from './document.schema';
import { Types } from 'mongoose';
import { DocumentDTO } from './DTO/documentDTO';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class DocumentService {
  constructor(
    @InjectModel('Document')
    private documentModel: Model<Document>
  ) {}
  
  async getAllDocument() : Promise<DocumentDTO[]> {
    const documents = await this.documentModel.find();
    const documentDTOs = plainToInstance(DocumentDTO,documents);
    return documentDTOs;
  }

  async createDocument(name: string, fileUrl: string, ownerId:string ) : Promise<void> {
    if (!name || ! fileUrl || !ownerId) {
      throw new BadRequestException('Missing name or email or fileUrl');
    }
    const owner = new Types.ObjectId(ownerId);
    const newdocument = await this.documentModel.create({owner,name,fileUrl});
  }

}
