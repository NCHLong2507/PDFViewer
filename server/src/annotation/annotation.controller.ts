import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AnnotationService } from './annotation.service';
@Controller('annotation')
export class AnnotationController {
  constructor(private readonly annotationService: AnnotationService) {}
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async createAnnotation(@Body() body: {documentID:string,annotID: string, xfdf: string}) {
    const { documentID, xfdf,annotID } = body;
    const newAnnotation = await this.annotationService.createAnnotation(documentID,annotID, xfdf);
    return {
      status: 'success',
      annotation: newAnnotation,
    };
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteAnnotation(@Query('annotID') annotID: string, @Query('documentID') documentID: string) {
    await this.annotationService.deleteAnnotation(documentID,annotID);
    return {
      status: 'success',
      message: 'Annotation deleted successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('modify')
  async updateAnnotation(@Body() body: {documentID: string, annotID: string, xfdf: string }) {
    const { documentID, annotID, xfdf } = body;
    await this.annotationService.updateAnnotation(documentID,annotID, xfdf);
    return {
      status: 'success',
      message: 'Annotation updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('load-xfdf')
  async getAnnotationsByDocumentId(@Query('id') documentID: string) {
    const xfdf = await this.annotationService.getAnnotationsByDocumentId(documentID);
    return {
      status: 'success',
      xfdf
    };
  }
}
