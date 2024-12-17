import { ValidationError } from '../errors';

export function validateRequired<T>(value: T | null | undefined, fieldName: string): T {
  if (value === null || value === undefined) {
    throw new ValidationError(`${fieldName} is required`);
  }
  return value;
}

export function validateUrl(url: string, fieldName: string = 'URL'): string {
  try {
    new URL(url);
    return url;
  } catch {
    throw new ValidationError(`Invalid ${fieldName} format`);
  }
}

export function validateImageUrl(url: string): string {
  const validatedUrl = validateUrl(url, 'Image URL');
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  if (!imageExtensions.some(ext => validatedUrl.toLowerCase().endsWith(ext))) {
    throw new ValidationError('URL must point to an image file');
  }
  
  return validatedUrl;
}

export function validateNumber(
  value: number,
  options: { min?: number; max?: number; fieldName?: string } = {}
): number {
  const { min, max, fieldName = 'Value' } = options;

  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a valid number`);
  }

  if (min !== undefined && value < min) {
    throw new ValidationError(`${fieldName} must be at least ${min}`);
  }

  if (max !== undefined && value > max) {
    throw new ValidationError(`${fieldName} must be at most ${max}`);
  }

  return value;
}