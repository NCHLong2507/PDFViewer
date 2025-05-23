import { Get,Post,Put, UploadedFile, UseInterceptors,UseGuards, Request as NestRequest, BadRequestException, Query, Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from './pipes/document-validation.pipe';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { storage } from 'src/cloudinary.storage';
import * as fs from 'fs';
import { DocumentPermissionDTO } from './DTO/document_permissionDTO';
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get('documentcount')
  async GetDocumentCount() {
    const document_count = await this.documentService.getDocumentCount();
    return {
      status: "success",
      count: document_count
    }
  }
  

  @UseGuards(JwtAuthGuard)
  @Get('documentInfor') 
  async GetDocumentInfor(@Query('id') _id: string) {
    const document = await this.documentService.getDocumentInfor(_id);
    return {
      status: "success",
      document
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('addaccesscontrol')
  async AddAcessControl(@Query('id')_id: string, @Body() body: { emailList: string[]; role: string }) {
    await this.documentService.AddDocumentAccessControl(_id, body); 
    return {
      status: "success"
    }
  }

  @UseGuards(JwtAuthGuard) 
  @Put('updateaccesscontrol') 
  async UpdateAccessControl(@Query('id')_id: string,@Body() body: DocumentPermissionDTO[] ) {
    await this.documentService.UpdateDocumentAcessControl(_id,body);
    return {
      status: "success"
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('documentpermission') 
  async GetDocumentPermission(@Query('id')_id: string) {
    const document_permission = await this.documentService.GetDocumentPermission(_id);
    return {
      status: "success",
      permission: document_permission
    }
  }

}
