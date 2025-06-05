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
  async deleteAnnotation(documentID: string, annotID: string): Promise<void> {
    if (!annotID || !documentID) {
      throw new BadRequestException('ID is required');
    }
    const result = await this.annotationModel.deleteOne({
      document: documentID,
      annotID,
    });
    await this.documentModel.findByIdAndUpdate(documentID, {
      $set: { updatedAt: new Date() },
    });
    if (result.deletedCount === 0) {
      throw new BadRequestException('Annotation not found');
    }
  }
  async updateAnnotation(
    documentID: string,
    annotID: string,
    xfdf: string,
  ): Promise<void> {
    if (!annotID || !documentID) {
      throw new BadRequestException('ID and xfdfe is required');
    }
    const result = await this.annotationModel.updateOne(
      { document: documentID, annotID },
      { $set: { xfdf } },
    );
    await this.documentModel.findByIdAndUpdate(documentID, {
      $set: { updatedAt: new Date() },
    });
    if (result.modifiedCount === 0) {
      throw new BadRequestException('Annotation not found or no changes made');
    }
  }
  async mergeXfdfStrings(xfdfList: string[]): Promise<string> {
    const parser = new xml2js.Parser();
    const builder = new xml2js.Builder({
      headless: false,
      xmldec: {
        version: '1.0',
        encoding: 'UTF-8',
      },
    });

    const allAnnots: Record<string, any[]> = {};

    for (const xfdf of xfdfList) {
      const parsed = await parser.parseStringPromise(xfdf);
      const annots = parsed?.xfdf?.annots?.[0];

      if (annots) {
        for (const [type, value] of Object.entries(annots)) {
          if (!Array.isArray(value)) continue;
          if (!allAnnots[type]) {
            allAnnots[type] = [];
          }
          allAnnots[type].push(...value);
        }
      }
    }

    const mergedXfdfObj = {
      xfdf: {
        $: {
          xmlns: 'http://ns.adobe.com/xfdf/',
          'xml:space': 'preserve',
        },
        annots: [allAnnots],
      },
    };

    return builder.buildObject(mergedXfdfObj);
  }
  async getAnnotationsByDocumentId(documentID: string): Promise<string> {
    if (!documentID) {
      throw new BadRequestException('Document ID is required');
    }
    const annotations = await this.annotationModel.find({
      document: documentID,
    });
    const xfdfList = annotations.map((a) => a.xfdf);
    const mergedXfdf = await this.mergeXfdfStrings(xfdfList);
    return mergedXfdf;
  }
}
