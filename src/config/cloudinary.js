import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Ensure Cloudinary is configured
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'fqlpski7',
  api_key: process.env.CLOUDINARY_API_KEY || '345719666552525',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'deja7J7kuQqA56wi-R6WyAdftMo'
});

export const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

// Memory storage keeps file in buffer for reliable, error-free streaming to Cloudinary
const memoryStorage = multer.memoryStorage();

export const uploadCloudinary = multer({
  storage: memoryStorage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

/**
 * Upload buffer or Base64 / URL directly to Cloudinary
 */
export const uploadBufferToCloudinary = (fileBuffer, mimetype, folder = 'daposh_fashion/products') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload stream error:', error);
          return reject(error);
        }
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

export const uploadImageToCloudinary = async (imageInput, folder = 'daposh_fashion/products') => {
  if (!isCloudinaryConfigured()) {
    return {
      url: imageInput,
      public_id: `mock_${Date.now()}`
    };
  }
  const result = await cloudinary.uploader.upload(imageInput, {
    folder,
    resource_type: 'auto'
  });
  return {
    url: result.secure_url,
    public_id: result.public_id
  };
};

export { cloudinary };
