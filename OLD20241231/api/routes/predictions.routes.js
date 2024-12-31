import express from 'express';
import Replicate from 'replicate';
import { logger } from '../utils/logger.js';
import { REPLICATE_MODEL_VERSION } from '../config/constants.js';

const router = express.Router();
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Get prediction status
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
      error: error.message || 'Failed to get prediction'
    });
  }
});

// Create new prediction
router.post('/', async (req, res) => {
  try {
    const { model, input } = req.body;
    
    logger.debug('Creating prediction:', { model, input });

    const prediction = await replicate.predictions.create({
      version: model,
      input
    });

    if (!prediction || prediction.error) {
      throw new Error(prediction?.error || 'Failed to create prediction');
    }

    logger.debug('Prediction created:', prediction);
    res.status(201).json(prediction);
  } catch (error) {
    logger.error('Create prediction error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create prediction'
    });
  }
});

export default router;