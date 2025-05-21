import { Get,Post, UploadedFile, UseInterceptors,UseGuards, Request as NestRequest, BadRequestException, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from './pipes/document-validation.pipe';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { storage } from 'src/cloudinary.storage';
import * as fs from 'fs';
@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService
  ){}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file',{storage,fileFilter: (req,file,cb) => {
    if (!file.originalname.toLowerCase().endsWith('.pdf')) {
      return cb(new BadRequestException('Please ensure the file is not more than 20MB and in .pdf format'), false);
    } 
    cb(null, true);
  }}))
  async uploadFile(@NestRequest() req,@UploadedFile( new FileSizeValidationPipe()) file: Express.Multer.File) {
    try {
      console.log(req.user)
      const documentDTO = await this.documentService.createDocument(file.originalname,file.path,req.user._id);
      return {
        status: "success",
        document: documentDTO
      }
    } catch (err) {
      const message = err.message?.toLowerCase() || '';
      if (message.includes('password')) {
        throw new BadRequestException('Please ensure the upload file does not require password');
      }
      throw err;
    }
    
  }


  @Get('loaddocument')
  async getDocumentLazyLoading(@Query('id')id: string, @Query('sort') sort: string) {
    let desc: boolean = true;
    if (sort && parseInt(sort,10) === 1 ) {desc = false;}
    const documents = await this.documentService.getDocumentLazyLoading(id,desc);
    return {
      status:"success",
      documents
    }
  }

  @Get('documentcount')
  async GetDocumentCount() {
    const document_count = await this.documentService.getDocumentCount();
    return {
      status: "success",
      count: document_count
    }
  }
}
