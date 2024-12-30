import { logger } from '../../utils/logger';
import { Prediction } from './types';
import { validateImageData, validatePredictionInput } from './validation';

const MODEL = "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa";

export async function createUpscalePrediction(
  imageUrl: string,
  scale: number,
  enhanceFace: boolean
): Promise<Prediction> {
  try {
    // Validate inputs
    validateImageData(imageUrl);
    validatePredictionInput(scale, enhanceFace);

    logger.debug('Creating prediction:', { imageUrl, scale, enhanceFace });

    const response = await fetch('/api/replicate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        input: {
          image: imageUrl,
          scale,
          face_enhance: enhanceFace
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API request failed: ${response.status}`);
    }

    if (!data.id) {
      throw new Error('Invalid response: missing prediction ID');
    }

    logger.debug('Prediction created successfully:', data);
    return {
      id: data.id,
      status: data.status,
      created_at: data.created_at
    };
  } catch (error) {
    logger.error('Failed to create prediction:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to create prediction');
  }
}

export async function getPredictionStatus(id: string): Promise<Prediction> {
  try {
    if (!id) {
      throw new Error('Prediction ID is required');
    }

    const response = await fetch(`/api/predictions/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Failed to check prediction status: ${response.status}`);
    }

    if (!data.status) {
      throw new Error('Invalid prediction response: missing status');
    }

    return data;
  } catch (error) {
    logger.error('Failed to get prediction status:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to get prediction status');
  }
}