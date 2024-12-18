import Replicate from '@replicate/browser';
import { REPLICATE_CONFIG } from './config';
import { logger } from '../utils/logger';

let replicateInstance: Replicate | null = null;

export function getReplicateClient(): Replicate {
  if (!replicateInstance) {
    replicateInstance = new Replicate({
      auth: REPLICATE_CONFIG.token
    });
    logger.debug('Replicate client initialized');
  }
  return replicateInstance;
}