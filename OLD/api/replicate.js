import { processImage } from './services/replicate.service.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl, scale, face_enhance } = req.body;
    console.debug('Processing request:', { imageUrl, scale, face_enhance });

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      console.error('Missing REPLICATE_API_TOKEN');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const result = await processImage(imageUrl, { scale, face_enhance });
    return res.status(200).json(result);
  } catch (error) {
    console.error('Processing failed:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process image'
    });
  }
}