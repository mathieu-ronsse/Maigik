import { logger } from '../utils/logger.js';

export function validateEnvironment() {
  const requiredVars = [
    {
      name: 'REPLICATE_API_TOKEN',
      message: 'Required for image processing with Replicate AI'
    }
  ];
  
  const missing = requiredVars.filter(({ name }) => {
    const value = process.env[name];
    return !value || value.includes('YOUR_') || value.includes('your-');
  });
  
  if (missing.length > 0) {
    const errorMessage = [
      'Missing or invalid environment variables:',
      ...missing.map(({ name, message }) => `  - ${name}: ${message}`),
      '',
      'Please follow these steps to fix:',
      '1. Create a .env file in the project root if it doesn\'t exist',
      '2. Copy the variables from .env.example to .env',
      '3. Replace the placeholder values with your actual API credentials',
      '  - Get your Replicate API token from: https://replicate.com/account',
      '',
      'Note: Never commit your .env file with real credentials to version control'
    ].join('\n');

    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  logger.debug('Environment variables validated successfully');
}