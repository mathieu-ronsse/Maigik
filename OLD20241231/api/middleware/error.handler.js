import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error('API Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  // Only include stack trace in development
  const response = {
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };
  
  res.status(statusCode).json(response);
}