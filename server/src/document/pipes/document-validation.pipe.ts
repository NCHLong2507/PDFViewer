import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const maxSize = 20 * 1024 * 1024; 
    const allowedExtension = /\.pdf$/i;
    if (!value || value.size> maxSize) {
      throw new BadRequestException('File is required.');
    }
    if (value.size > maxSize || !allowedExtension.test(value.originalname)) {
      throw new BadRequestException('Please ensure the file is not more than 20MB and in .pdf format');
    }
    return value;
  }
}
