import { logger } from '../../utils/logger';
import { Prediction, PredictionResponse } from './types';

const MODEL = "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa";

export async function createUpscalePrediction(
  imageUrl: string,
  scale: number,
  enhanceFace: boolean
): Promise<Prediction> {
  try {
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
      throw new Error('Invalid prediction response: missing ID');
    }

    return data;
  } catch (error) {
    logger.error('Failed to create prediction:', error);
    throw error;
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
    throw error;
  }
}