import Replicate from 'replicate';
import { logger } from '../utils/logger.js';

// Initialize Replicate client
export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Model configuration
export const MODELS = {
  ESRGAN: {
    version: 'nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa',
    defaultOptions: {
      scale: 2,
      face_enhance: false
    }
  }
} //as const;

// Validate Replicate configuration
export function validateReplicateConfig() {
  if (!process.env.REPLICATE_API_TOKEN) {
    const error = new Error('REPLICATE_API_TOKEN environment variable is not set');
    logger.error(error.message);
    throw error;
  }
}