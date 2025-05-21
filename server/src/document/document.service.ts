import { BadRequestException, Injectable, Query } from '@nestjs/common';
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
  
  async getDocumentLazyLoading(id: string, desc: boolean = true) : Promise<DocumentDTO[]> {
    const page = parseInt(id, 10); 
    const limit = 10;
    const skip = page * limit;
    const updatedAt = desc ? -1 : 1;
    const documents = await this.documentModel
    .find()
    .sort({ updatedAt })
    .skip(skip)
    .limit(limit)
    .populate('owner', { name: 1, email: 1 });
    const documentDTOs = plainToInstance(DocumentDTO,documents,{excludeExtraneousValues:true});  
    return documentDTOs; 
  }

  async createDocument(name: string, fileUrl: string, ownerId:string ) : Promise<DocumentDTO> {
    if (!name || ! fileUrl || !ownerId) {
      throw new BadRequestException('Missing name or email or fileUrl');
    }
    const owner = new Types.ObjectId(ownerId);
    const newdocument = await this.documentModel.create({owner,name,fileUrl});
    const populatedDocument = await this.documentModel.findById(newdocument._id).populate('owner', 'name email')
    const documentDTO = plainToInstance(DocumentDTO, populatedDocument, { excludeExtraneousValues: true });    
    return documentDTO; 
  }

  async getDocumentCount() : Promise<number> {
    return await this.documentModel.countDocuments();
  } 
}
