import express from 'express';
import Replicate from 'replicate';
import { logger } from '../utils/logger.js';

const router = express.Router();
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

router.post('/', async (req, res) => {
  try {
    const { model, input } = req.body;
    
    logger.debug('Processing request:', { model, input });

    const output = await replicate.run(model, { input });
    
    logger.debug('Replicate processing completed:', output);

    res.json({ output });
  } catch (error) {
    logger.error('Processing error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to process image'
    });
  }
});

export default router;