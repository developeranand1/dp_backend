import express from 'express';
import { uploadCloudinary } from '../config/cloudinary.js';
import { uploadFile, uploadFromUrlOrBase64 } from '../controllers/uploadController.js';

const router = express.Router();

// Upload image file to Cloudinary
router.post('/file', uploadCloudinary.single('image'), uploadFile);

// Upload image via URL or Base64 to Cloudinary
router.post('/url', uploadFromUrlOrBase64);

export default router;
