import express from 'express';
import { processImage } from '../services/replicate.service.js';
import { handleApiError } from '../utils/error.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ 
        error: 'Image URL is required' 
      });
    }

    const outputUrl = await processImage(imageUrl);
    res.json({ outputUrl });
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('Processing error:', error);
    res.status(apiError.statusCode).json({ 
      error: apiError.message 
    });
  }
});

export default router;