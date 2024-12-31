import { createServerApi } from './server';
import { logger } from '../utils/logger';
import { ProcessResult } from '../replicate/types/prediction';

const api = createServerApi();

export async function processImage(
  imageUrl: string,
  options: { scale?: number; face_enhance?: boolean } = {}
): Promise<ProcessResult> {
  try {
    logger.debug('Sending processing request:', { imageUrl, options });

    const response = await api.post('/replicate', {
      imageUrl,
      ...options
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `Processing failed: ${response.status}`);
    }

    logger.debug('Processing result:', result);

    if (!result.outputUrl) {
      throw new Error('No output URL received from processing');
    }

    return {
      success: true,
      outputUrl: result.outputUrl
    };
  } catch (error) {
    logger.error('Failed to process image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process image'
    };
  }
}