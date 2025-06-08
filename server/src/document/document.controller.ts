import {
  Get,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request as NestRequest,
  BadRequestException,
  Query,
  Body,
  Patch,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from './pipes/document-validation.pipe';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ActionGuard } from 'src/auth/actions.guard';
import { storage } from 'src/cloudinary/cloudinary.storage';
import * as fs from 'fs';
import { DocumentPermissionDTO } from './DTO/document_permissionDTO';
import path from 'path';
import { Request } from 'express';
import { UserDTO } from 'src/user/DTO/UserDTO';
import { CheckAction } from 'src/auth/actions.decorator';
@Controller('document')
export class DocumentController {
  private readonly storageDir: string;

  constructor(private readonly documentService: DocumentService) {}

  @Post('uploadfromlocal')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: (req, file, cb) => {
        if (!file.originalname.toLowerCase().endsWith('.pdf')) {
          return cb(
            new BadRequestException(
              'Please ensure the file is not more than 20MB and in .pdf format',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @NestRequest() req,
    @UploadedFile(new FileSizeValidationPipe()) file: Express.Multer.File,
  ) {
    try {
      const documentDTO = await this.documentService.createDocument(
        file.originalname,
        file.path,
        req.user._id,
      );
      return {
        status: 'success',
        document: documentDTO,
      };
    } catch (err) {
      const message = err.message?.toLowerCase() || '';
      if (message.includes('password')) {
        throw new BadRequestException(
          'Please ensure the upload file does not require password',
        );
      }
      throw err;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('uploadfromdrive')
  async uploadFromDrive(
    @NestRequest() req,
    @Body()
    body: {
      fileId: string;
      fileName: string;
      mimeType: string;
      webViewLink: string;
      access_token: string;
    },
  ) {
    try {
      const documentDTO = await this.documentService.uploadFromDrive(
        body,
        req.user._id,
      );
      return {
        status: 'success',
        document: documentDTO,
      };
    } catch (err) {
      const message = err.message?.toLowerCase() || '';
      throw err;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('loaddocument')
  async getDocumentLazyLoading(
    @Query('id') id: string,
    @Query('sort') sort: string,
    @NestRequest() req: Request,
  ) {
    let desc: boolean = true;
    if (sort && parseInt(sort, 10) === 1) {
      desc = false;
    }
    const documents = await this.documentService.getDocumentLazyLoading(
      id,
      desc,
      req.user as UserDTO,
    );
    return {
      status: 'success',
      documents,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('documentcount')
  async GetDocumentCount(@NestRequest() req: Request) {
    const document_count = await this.documentService.getDocumentCountByUser(
      req.user as UserDTO,
    );
    return {
      status: 'success',
      count: document_count,
    };
  }

  @UseGuards(JwtAuthGuard, ActionGuard)
  @CheckAction('VIEW')
  @Get('documentInfor')
  async GetDocumentInfor(@Query('id') _id: string) {
    const document = await this.documentService.getDocumentInfor(_id);
    return {
      status: 'success',
      document,
    };
  }

  @UseGuards(JwtAuthGuard,ActionGuard)
  @CheckAction('VIEW')
  @Patch('setLoadingFirst')
  async SetLoadingFirst(@Query('id') _id: string) {
    await this.documentService.setDocumentLoadingFirst(_id);
    return {
      status: 'success',
    };
  }

  @UseGuards(JwtAuthGuard,ActionGuard)
  @CheckAction('ADD')
  @Post('addaccesscontrol')
  async AddAcessControl(
    @Query('id') _id: string,
    @Body() body: { emailList: string[]; role: string },
  ) {
    await this.documentService.AddDocumentAccessControl(_id, body);
    return {
      status: 'success',
    };
  }

  @UseGuards(JwtAuthGuard,ActionGuard)
  @CheckAction('ADD')
  @Put('updateaccesscontrol')
  async UpdateAccessControl(
    @Query('id') _id: string,
    @Body() body: DocumentPermissionDTO[],
  ) {
    await this.documentService.UpdateDocumentAcessControl(_id, body);
    return {
      status: 'success',
    };
  }

  @UseGuards(JwtAuthGuard,ActionGuard)
  @CheckAction('VIEW')
  @Get('documentpermission')
  async GetDocumentPermission(@Query('id') _id: string) {
    const document_permission =
      await this.documentService.GetDocumentPermission(_id);
    return {
      status: 'success',
      permission: document_permission,
    };
  }
}
