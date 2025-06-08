import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ActionGuard } from 'src/auth/actions.guard';
import { AnnotationService } from './annotation.service';
import { CheckAction } from 'src/auth/actions.decorator';
@Controller('annotation')
export class AnnotationController {
  constructor(private readonly annotationService: AnnotationService) {}
  @UseGuards(JwtAuthGuard,ActionGuard)
  @CheckAction("EDIT")
  @Post('updateAnnotation')
  async UpdateAnnotations(
    @Body()
    body: {
      annotations: { annotID: string; xfdf: string };
    },
    @Query('id') documentID: string
  ) {
    const { annotations } = body;
    if (!documentID) {
      throw new BadRequestException('DocumentID is required');
    }
    const promises = Object.entries(annotations).map(([annotID, xfdf]) => {
      if (xfdf === '') {
        return this.annotationService.deleteAnnotation(documentID, annotID);
      } else {
        return this.annotationService.updateAnnotation(
          documentID,
          annotID,
          xfdf,
        );
      }
    });

    await Promise.all(promises);
    return {
      status: 'success',
    };
  }

  @UseGuards(JwtAuthGuard,ActionGuard)
  @CheckAction("EDIT")
  @Post('add')
  async createAnnotation(@Body() body: {annotID: string, xfdf: string}, @Query('id') documentID:string) {
    const { xfdf,annotID } = body;
    const newAnnotation = await this.annotationService.createAnnotation(documentID,annotID, xfdf);
    return {
      status: 'success',
      annotation: newAnnotation,
    };
  }

  @UseGuards(JwtAuthGuard,ActionGuard)
  @CheckAction("VIEW")
  @Get('load-xfdf')
  async getAnnotationsByDocumentId(@Query('id') documentID: string) {
    const xfdf =
      await this.annotationService.getAnnotationsByDocumentId(documentID);
    return {
      status: 'success',
      xfdf,
    };
  }
}
