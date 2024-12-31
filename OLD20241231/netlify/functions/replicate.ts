import { Handler } from '@netlify/functions';
import { processImage } from '../../src/lib/replicate/service';
import { logger } from '../../src/lib/utils/logger';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { imageUrl, scale, face_enhance } = JSON.parse(event.body || '{}');

    if (!imageUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Image URL is required' })
      };
    }

    const result = await processImage(imageUrl, { scale, face_enhance });
    return {
      statusCode: result.success ? 200 : 500,
      body: JSON.stringify(result)
    };
  } catch (error) {
    logger.error('Processing failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to process image'
      })
    };
  }
}