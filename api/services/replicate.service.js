import Replicate from 'replicate';
import { REPLICATE_MODEL_VERSION } from '../config/constants.js';
import { logger } from '../utils/logger.js';

export async function processImage(imageUrl, options = {}) {
  logger.debug('Processing image with options:', { imageUrl, options });

  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN is not set');
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    logger.debug('Initializing Replicate prediction...');
    
    const output = await replicate.run(
      REPLICATE_MODEL_VERSION,
      {
        input: {
          image: imageUrl,
          scale: options.scale || 2,
          face_enhance: options.face_enhance || false
        }
      }
    );

    logger.debug('Replicate processing completed:', output);

    // Handle both array and string outputs
    const outputUrl = Array.isArray(output) ? output[0] : output;

    if (!outputUrl) {
      throw new Error('No output URL received from Replicate');
    }

    return { outputUrl };
  } catch (error) {
    logger.error('Replicate processing failed:', error);
    
    // Enhance error message for common issues
    if (error.message.includes('401')) {
      throw new Error('Invalid Replicate API token. Please check your environment variables.');
    } else if (error.message.includes('429')) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    throw error;
  }
}