import { logger } from '../utils/logger';
import { ProcessResult } from './types/prediction';
import { validateImageUrl, validateNumber } from '../utils/validation';
import { createPrediction, pollPrediction } from './api/predictions';
import { MODELS } from './models';

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

    // Create prediction
    const prediction = await createPrediction(imageUrl, {
      scale,
      face_enhance: options.face_enhance || false
    });

    // Poll for result
    const result = await pollPrediction(prediction.id);

    if (!result.outputUrl) {
      throw new Error('No output URL received from processing');
    }

    return result;
  } catch (error) {
    logger.error('Failed to process image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process image'
    };
  }
}