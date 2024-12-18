import { getReplicateClient } from './client';
import { REPLICATE_CONFIG } from './config';
import { ProcessOptions } from './types/input';
import { ProcessResult } from './types/prediction';
import { validateUpscaleInput, validateScale } from './validators';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/errors';

export async function processImage(
  imageUrl: string, 
  options: ProcessOptions = {}
): Promise<ProcessResult> {
  try {
    // Validate inputs
    validateUpscaleInput({ image: imageUrl });
    const scale = options.scale || REPLICATE_CONFIG.models.upscale.defaultOptions.scale;
    validateScale(scale);

    const input = {
      image: imageUrl,
      scale,
      face_enhance: options.face_enhance || false
    };

    logger.debug('Processing image with Replicate:', {
      model: REPLICATE_CONFIG.models.upscale.id,
      version: REPLICATE_CONFIG.models.upscale.version,
      input
    });

    const replicate = getReplicateClient();
    
    const output = await replicate.run(
      `${REPLICATE_CONFIG.models.upscale.id}:${REPLICATE_CONFIG.models.upscale.version}`,
      { input }
    );

    logger.debug('Replicate API response:', output);

    if (!output || (Array.isArray(output) && output.length === 0)) {
      throw new ApiError('No output received from Replicate API');
    }

    const outputUrl = Array.isArray(output) ? output[0] : output;

    if (typeof outputUrl !== 'string') {
      throw new ApiError('Invalid output format from Replicate API');
    }

    logger.debug('Processing complete, output URL:', outputUrl);

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