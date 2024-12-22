import { logger } from '../../utils/logger';
import { ProcessResult } from '../types/prediction';

interface PredictionResponse {
  id: string;
  status: string;
  output?: string | string[];
  error?: string;
}

async function handleResponse(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    throw new Error('Invalid response format from server');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || `HTTP error! status: ${response.status}`);
  }

  return data;
}

export async function createPrediction(
  imageUrl: string, 
  options: { scale?: number; face_enhance?: boolean } = {}
): Promise<PredictionResponse> {
  try {
    logger.debug('Creating prediction:', { imageUrl, options });

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl,
        ...options
      }),
    });

    const prediction = await handleResponse(response);
    logger.debug('Prediction created:', prediction);
    return prediction;
  } catch (error) {
    logger.error('Create prediction error:', error);
    throw error;
  }
}

export async function getPrediction(id: string): Promise<PredictionResponse> {
  try {
    logger.debug('Getting prediction:', { id });

    const response = await fetch(`/api/predictions/${id}`);
    const prediction = await handleResponse(response);

    logger.debug('Prediction retrieved:', prediction);
    return prediction;
  } catch (error) {
    logger.error('Get prediction error:', error);
    throw error;
  }
}

export async function pollPrediction(id: string): Promise<ProcessResult> {
  let attempts = 0;
  const maxAttempts = 30; // 30 seconds timeout
  
  while (attempts < maxAttempts) {
    try {
      const prediction = await getPrediction(id);
      
      if (prediction.status === "succeeded") {
        const outputUrl = Array.isArray(prediction.output) 
          ? prediction.output[0] 
          : prediction.output;

        if (!outputUrl) {
          throw new Error('No output URL in successful prediction');
        }

        return {
          success: true,
          outputUrl
        };
      }
      
      if (prediction.status === "failed") {
        throw new Error(prediction.error || 'Prediction failed');
      }
      
      // Wait 1 second before polling again
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    } catch (error) {
      logger.error('Poll prediction error:', error);
      throw error;
    }
  }

  throw new Error('Prediction timeout');
}