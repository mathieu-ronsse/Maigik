import express from 'express';
import Replicate from 'replicate';
import { logger } from '../utils/logger.js';
import { REPLICATE_MODEL_VERSION } from '../config/constants.js';

const router = express.Router();
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Validate request middleware
const validateRequest = (req, res, next) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ 
      detail: 'Image URL is required' 
    });
  }
  next();
};

router.post('/', validateRequest, async (req, res) => {
  try {
    const { imageUrl, scale = 2, face_enhance = false } = req.body;

    logger.debug('Creating prediction:', { imageUrl, scale, face_enhance });

    const prediction = await replicate.predictions.create({
      version: REPLICATE_MODEL_VERSION,
      input: {
        image: imageUrl,
        scale,
        face_enhance
      }
    });

    if (!prediction || prediction.error) {
      throw new Error(prediction?.error || 'Failed to create prediction');
    }

    logger.debug('Prediction created:', prediction);
    res.status(201).json(prediction);
  } catch (error) {
    logger.error('Create prediction error:', error);
    res.status(500).json({ 
      detail: error.message || 'Failed to create prediction'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    logger.debug('Getting prediction:', { id });

    const prediction = await replicate.predictions.get(id);

    if (!prediction || prediction.error) {
      throw new Error(prediction?.error || 'Failed to get prediction');
    }

    logger.debug('Prediction retrieved:', prediction);
    res.json(prediction);
  } catch (error) {
    logger.error('Get prediction error:', error);
    res.status(500).json({ 
      detail: error.message || 'Failed to get prediction'
    });
  }
});

export default router;