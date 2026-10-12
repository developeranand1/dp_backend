import { uploadBufferToCloudinary, uploadImageToCloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

/**
 * Handle multipart form file upload directly to Cloudinary
 */
export const uploadFile = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    // Stream the file buffer directly to Cloudinary
    const result = await uploadBufferToCloudinary(req.file.buffer, req.file.mimetype);

    return res.json({
      success: true,
      message: 'Image uploaded to Cloudinary successfully!',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        bytes: result.bytes
      }
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({ success: false, message: error.message || 'Cloudinary upload failed' });
  }
};

/**
 * Handle Base64 or external Image URL upload to Cloudinary
 */
export const uploadFromUrlOrBase64 = async (req, res) => {
  try {
    const { image, folder = 'daposh_fashion/products' } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Image base64 data or URL is required' });
    }

    const result = await uploadImageToCloudinary(image, folder);

    return res.json({
      success: true,
      message: isCloudinaryConfigured()
        ? 'Image synced to Cloudinary'
        : 'Image received (direct URL / simulation mode)',
      data: result
    });
  } catch (error) {
    console.error('Upload URL/base64 error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
