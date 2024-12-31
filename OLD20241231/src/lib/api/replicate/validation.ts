import { ValidationError } from '../../utils/errors';

export function validateImageData(imageUrl: string): void {
  if (!imageUrl) {
    throw new ValidationError('Image data is required');
  }

  // Validate data URL format for base64 images
  if (imageUrl.startsWith('data:')) {
    if (!imageUrl.startsWith('data:image/')) {
      throw new ValidationError('Invalid image format');
    }
    return;
  }

  // Validate URL format for remote images
  try {
    new URL(imageUrl);
  } catch {
    throw new ValidationError('Invalid image URL format');
  }
}

export function validatePredictionInput(
  scale: number,
  enhanceFace: boolean
): void {
  if (typeof scale !== 'number' || scale < 1 || scale > 4) {
    throw new ValidationError('Scale must be between 1 and 4');
  }

  if (typeof enhanceFace !== 'boolean') {
    throw new ValidationError('Face enhance must be a boolean value');
  }
}