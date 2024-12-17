import Replicate from 'replicate';
import { logger } from '../utils/logger';
import { getEnvVar } from '../config/env';
import { AuthenticationError } from '../utils/errors';

function createReplicateClient(): Replicate {
  try {
    const token = getEnvVar('REPLICATE_API_TOKEN');
    
    return new Replicate({
      auth: token
    });
  } catch (error) {
    logger.error('Failed to create Replicate client:', error);
    throw new AuthenticationError('Replicate API token is not configured');
  }
}

export const replicate = createReplicateClient();