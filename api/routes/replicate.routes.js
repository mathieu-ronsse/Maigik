import express from 'express';
import { logger } from '../utils/logger.js';
import { REPLICATE_MODEL_VERSION } from '../config/constants.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { model, input } = req.body;
    const token = process.env.REPLICATE_API_TOKEN;
    
    if (!token) {
      throw new Error('REPLICATE_API_TOKEN is not configured');
    }
    
    logger.debug('Creating prediction:', { model, input });

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: REPLICATE_MODEL_VERSION,
        input: {
          image: input.image,
          scale: input.scale || 2,
          face_enhance: input.face_enhance || false
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || `Replicate API error: ${response.status}`);
    }

    if (!data.id) {
      throw new Error('Invalid response from Replicate API: missing prediction ID');
    }

    logger.debug('Prediction created:', data);
    res.json({
      id: data.id,
      status: data.status,
      created_at: data.created_at
    });
  } catch (error) {
    logger.error('Failed to create prediction:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to process image'
    });
  }
});

export default router;