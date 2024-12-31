import { logger } from '../../utils/logger';
import { REPLICATE_API } from '../api/endpoints';

export async function testReplicateConnection(): Promise<boolean> {
  try {
    const token = import.meta.env.VITE_REPLICATE_API_TOKEN;
    
    if (!token) {
      throw new Error('REPLICATE_API_TOKEN not found in environment variables');
    }

    logger.debug('Testing API connection with endpoint:', `${REPLICATE_API.BASE_URL}/predictions`);

    const response = await fetch(`${REPLICATE_API.BASE_URL}/predictions`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Check if response is HTML (error page)
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/html')) {
      throw new Error('Received HTML response instead of JSON. Check API endpoint configuration.');
    }

    const data = await response.json();
    logger.debug('API response:', data);

    return true;
  } catch (error) {
    logger.error('Replicate API connection failed:', error);
    if (error instanceof Error) {
      // Extract useful information from the error
      const message = error.message.includes('<!DOCTYPE')
        ? 'Invalid API endpoint configuration'
        : error.message;
      throw new Error(message);
    }
    return false;
  }
}