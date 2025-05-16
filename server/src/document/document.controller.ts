import { Get,Post, UploadedFile, UseInterceptors,UseGuards, Request as NestRequest } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from './pipes/document-validation.pipe';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { storage } from 'src/cloudinary.storage';
@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService
  ){}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file',{storage}))
  async uploadFile(@NestRequest() req,@UploadedFile( new FileSizeValidationPipe()) file: Express.Multer.File) {
    await this.documentService.createDocument(file.originalname,file.path,req.user._id);
    return {
      status: "success"
    }
  }

  @Get('')
  async getAllDocument() {
    const documents = await this.documentService.getAllDocument();
    return {
      status:"success",
      documents
    }
  }
}
