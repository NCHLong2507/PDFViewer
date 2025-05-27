import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class DocumentService {
  async uploadFromDrive(fileData: { id: string; name: string; mimeType: string; webViewLink: string }) {
    try {
      const response = await axios.get(fileData.webViewLink, { responseType: 'stream' });

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'Document',
            resource_type: 'auto', 
            public_id: fileData.name.split('.')[0],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        response.data.pipe(stream);
      });

      return uploadResult; 
    } catch (err) {
      throw new BadRequestException('Failed to upload file from Google Drive: ' + err.message);
    }
  }
}
