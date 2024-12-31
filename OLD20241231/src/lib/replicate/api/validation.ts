import { ValidationError } from '../../utils/errors/types';

export function validateApiToken(token: string | undefined): string {
  if (!token) {
    throw new ValidationError('REPLICATE_API_TOKEN is required');
  }
  
  if (token.length < 20) {
    throw new ValidationError('Invalid REPLICATE_API_TOKEN format');
  }
  
  return token;
}

export function validatePredictionInput(input: Record<string, unknown>): void {
  if (!input || Object.keys(input).length === 0) {
    throw new ValidationError('Prediction input is required');
  }
}

export function validateModelVersion(version: string): void {
  if (!version) {
    throw new ValidationError('Model version is required');
  }
  
  if (!version.includes(':')) {
    throw new ValidationError('Invalid model version format');
  }
}