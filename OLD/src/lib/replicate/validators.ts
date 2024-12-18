import { ValidationError } from '../utils/errors';

export function validateUpscaleInput(input: unknown): asserts input is { image: string } {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Invalid input object');
  }

  const { image } = input as { image?: unknown };

  if (!image || typeof image !== 'string') {
    throw new ValidationError('Image URL is required and must be a string');
  }

  try {
    new URL(image);
  } catch {
    throw new ValidationError('Invalid image URL format');
  }
}

export function validateScale(scale: unknown): asserts scale is number {
  if (typeof scale !== 'number' || isNaN(scale) || scale < 1 || scale > 10) {
    throw new ValidationError('Scale must be a number between 1 and 10');
  }
}