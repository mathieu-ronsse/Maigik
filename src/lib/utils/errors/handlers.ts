import { ApiError } from './types';

export function handleError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new ApiError('An unexpected error occurred');
}