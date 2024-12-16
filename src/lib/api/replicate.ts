import { createServerApi } from './server';
import { handleApiError } from '../../utils/api/errors';
import { logger } from '../../utils/logger';

const api = createServerApi();

export interface ProcessOptions {
  scale: number;
  face_enhance: boolean;
}

export interface ReplicateResponse {
  outputUrl: string;
}

export async function processWithReplicate(imageUrl: string, options: ProcessOptions): Promise<string> {
  const payload = { imageUrl, ...options };
  logger.debug('Replicate request:', payload);

  try {
    //console.log("Replicate model and version:", model, version);

    const response = await api.post('/replicate', payload);
    
    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Replicate API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });

      let errorMessage: string;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || `Processing failed: ${response.status}`;
      } catch {
        errorMessage = `Processing failed: ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    logger.debug('Replicate response:', data);

    if (!data.outputUrl) {
      throw new Error('No output URL received from processing');
    }

    return data.outputUrl;
  } catch (error) {
    logger.error('Replicate processing failed:', error);
    throw handleApiError(error);
  }
}