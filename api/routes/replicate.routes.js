import express from 'express';
import { processImage } from '../services/replicate.service.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { imageUrl, scale, face_enhance } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ 
        error: 'Image URL is required' 
      });
    }

    logger.debug('Processing request:', { imageUrl, scale, face_enhance });

    const result = await processImage(imageUrl, { scale, face_enhance });
    res.json(result);
  } catch (error) {
    logger.error('Processing error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to process image'
    });
  }
});

export default router;