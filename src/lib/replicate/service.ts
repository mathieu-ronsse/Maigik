import Replicate from 'replicate';
import { logger } from '../utils/logger';
import { MODELS } from './models';
import { ProcessResult } from './types/prediction';
import { validateImageUrl, validateNumber } from '../utils/validation';

export async function processImage(
  imageUrl: string, 
  options: { scale?: number; face_enhance?: boolean } = {}
): Promise<ProcessResult> {
  try {
    // Validate inputs
    validateImageUrl(imageUrl);
    const scale = validateNumber(options.scale || MODELS.ESRGAN.defaultOptions.scale, {
      min: 1,
      max: 10,
      fieldName: 'Scale'
    });

    logger.debug('Processing image with options:', { imageUrl, options });

    const replicate = new Replicate({
      auth: import.meta.env.VITE_REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
      MODELS.ESRGAN.version,
      {
        input: {
          image: imageUrl,
          scale,
          face_enhance: options.face_enhance || false
        }
      }
    );

    // The output is either a string or an array of strings, get the first URL
    const outputUrl = Array.isArray(output) ? output[0] : output;

    if (!outputUrl) {
      throw new Error('No output URL received from processing');
    }

    return {
      success: true,
      outputUrl
    };
  } catch (error) {
    logger.error('Failed to process image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process image'
    };
  }
}