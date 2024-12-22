import { replicate, MODELS } from '../config/replicate.js';
import { logger } from '../utils/logger.js';

export async function processImage(imageUrl, options = {}) {
  try {
    logger.debug('Processing image with options:', { imageUrl, options });

    const output = await replicate.run(
      MODELS.ESRGAN.version,
      {
        input: {
          image: imageUrl,
          scale: options.scale || MODELS.ESRGAN.defaultOptions.scale,
          face_enhance: options.face_enhance || MODELS.ESRGAN.defaultOptions.face_enhance
        }
      }
    );

    logger.debug('Replicate processing completed:', output);

    // Handle both array and string outputs
    const outputUrl = Array.isArray(output) ? output[0] : output;

    if (!outputUrl) {
      throw new Error('No output URL received from Replicate');
    }

    return { success: true, outputUrl };
  } catch (error) {
    logger.error('Replicate processing failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process image'
    };
  }
}