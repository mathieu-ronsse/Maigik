import { logger } from '../../utils/logger';
import { ReplicateApiClient } from '../api/client';
import { Prediction } from '../types/prediction';

interface PollOptions {
  maxAttempts?: number;
  interval?: number;
}

export async function pollPrediction(
  client: ReplicateApiClient,
  predictionId: string,
  options: PollOptions = {}
): Promise<string> {
  const { maxAttempts = 30, interval = 1000 } = options;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const prediction = await client.getPrediction<Prediction>(predictionId);
    logger.debug('Prediction status:', prediction);

    if (prediction.status === 'succeeded') {
      const output = prediction.output;
      if (!output) {
        throw new Error('Prediction succeeded but no output was received');
      }
      return Array.isArray(output) ? output[0] : output;
    }

    if (prediction.status === 'failed') {
      throw new Error(prediction.error || 'Processing failed');
    }

    await new Promise(resolve => setTimeout(resolve, interval));
    attempts++;
  }

  throw new Error('Timeout waiting for prediction result');
}