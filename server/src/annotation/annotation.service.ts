import { BadRequestException, Injectable } from '@nestjs/common';
import { Annotation } from './annotation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnnotationDTO } from './DTO/annotationDTO';
import { plainToInstance } from 'class-transformer';
import * as xml2js from 'xml2js';
import { Document } from '../document/schema/document.schema';
@Injectable()
export class AnnotationService {
  constructor(
    @InjectModel('Annotation')
    private annotationModel: Model<Annotation>,
    @InjectModel('Document')
    private documentModel: Model<Document>,
  ) {}
  async deleteAnnotation(documentID: string, annotID: string): Promise<void> {
    if (!annotID || !documentID) {
      throw new BadRequestException('ID is required');
    }
    await this.annotationModel.deleteOne({
      document: documentID,
      annotID,
    });
    await this.documentModel.findByIdAndUpdate(documentID, {
      $set: { updatedAt: new Date() },
    });
  }
  async updateAnnotation(
    documentID: string,
    annotID: string,
    xfdf: string,
  ): Promise<void> {
    if (!annotID || !documentID) {
      throw new BadRequestException('ID and xfdfe is required');
    }

    await this.annotationModel.updateOne(
      { document: documentID, annotID },
      { xfdf },
      { upsert: true },
    );
    await this.documentModel.findByIdAndUpdate(documentID, {
      $set: { updatedAt: new Date() },
    });
  }
  async createAnnotation(
    documentID: string,
    annotID: string,
    xfdf: string,
  ): Promise<AnnotationDTO> {
    if (!xfdf || !documentID) {
      throw new BadRequestException('XFDF and Document ID are required');
    }
    const newAnnotation = await this.annotationModel.create({
      xfdf,
      document: documentID,
      annotID,
    });

    const annotationDTO = plainToInstance(AnnotationDTO, newAnnotation, {
      excludeExtraneousValues: true,
    });
    await this.documentModel.findByIdAndUpdate(documentID, {
      $set: { updatedAt: new Date() },
    });
    return annotationDTO;
  }
  extractAnnots(xmlString) {
    const match = xmlString.match(/<annots>[\s\S]*?<\/annots>/);
    return match
      ? match[0].replace('<annots>', '').replace('</annots>', '')
      : '';
  }
  async getAnnotationsByDocumentId(documentID: string): Promise<string> {
    if (!documentID) {
      throw new BadRequestException('Document ID is required');
    }
    const annotations = await this.annotationModel
      .find({
        document: documentID,
      })
      .lean();

    const annotsXml = annotations.map((a) => this.extractAnnots(a.xfdf)).join();
    const xfdf = `<?xml version="1.0" encoding="UTF-8"?> <xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"> <fields /> <annots> ${annotsXml} </annots> </xfdf>`;
    return xfdf;
  }
}
