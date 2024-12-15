import express from 'express';
import { processImage } from '../services/replicate.service.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const outputUrl = await processImage(imageUrl);
    res.json({ outputUrl });
  } catch (error) {
    next(error);
  }
});

export default router;