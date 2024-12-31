export class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export function handleApiError(error) {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return error;
  }
  
  return new ApiError(
    error.message || 'An unexpected error occurred',
    error.statusCode || 500
  );
}