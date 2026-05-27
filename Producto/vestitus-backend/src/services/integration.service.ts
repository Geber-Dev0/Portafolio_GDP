import { v2 as cloudinary } from 'cloudinary';
import config from '@config';

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret
});

export const uploadImage = async (fileBuffer: Buffer, fileName: string) => {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'ropa-backend/products',
        resource_type: 'image',
        public_id: fileName.replace(/\.[^/.]+$/, ''),
        overwrite: true
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error('Cloudinary upload returned no result'));
        }

        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export const deleteImage = async (publicId: string) => {
  return new Promise<{ result: string }>((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { invalidate: true }, (error, result) => {
      if (error) {
        return reject(error);
      }

      if (!result) {
        return reject(new Error('Cloudinary destroy returned no result'));
      }

      resolve({ result: result.result });
    });
  });
};
