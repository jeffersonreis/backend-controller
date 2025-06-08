// src/cloudinary/cloudinary.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CLOUDINARY } from './constants';
import { CloudinaryResponse } from './cloudinary-response';
import { v2 as cloudinaryLib } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject(CLOUDINARY) private cloudinary: typeof cloudinaryLib) {}

  async uploadFile(file: { buffer: Buffer; [key: string]: any }): Promise<CloudinaryResponse | undefined> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteFile(publicId: string): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
  }
}
