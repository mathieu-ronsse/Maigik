import { replicate } from './client';
import { MODELS } from './models';
import { ProcessOptions, ProcessResult } from './types';
import { logger } from '../utils/logger';
import { validateImageUrl, validateNumber } from '../utils/validation';
import { handleError } from '../utils/errors';

export async function processImage(
  imageUrl: string, 
  options: ProcessOptions = {}
): Promise<ProcessResult> {
  try {
    // Validate inputs
    const validatedUrl = validateImageUrl(imageUrl);
    const scale = validateNumber(options.scale || MODELS.ESRGAN.defaultOptions.scale, {
      min: 1,
      max: 10,
      fieldName: 'Scale'
    });

    logger.debug('Processing image with options:', { imageUrl: validatedUrl, options });

    const prediction = await replicate.run(
      MODELS.ESRGAN.version,
      {
        input: {
          image: validatedUrl,
          scale,
          face_enhance: options.face_enhance || MODELS.ESRGAN.defaultOptions.face_enhance
        }
      }
    );

    logger.debug('Prediction result:', prediction);

    // Replicate returns an array with one URL for this model
    const outputUrl = Array.isArray(prediction) ? prediction[0] : prediction;

    if (!outputUrl) {
      throw new Error('No output URL received from Replicate');
    }

    return {
      success: true,
      outputUrl
    };
  } catch (error) {
    logger.error('Failed to process image:', error);
    const handledError = handleError(error);
    return {
      success: false,
      error: handledError.message
    };
  }
}