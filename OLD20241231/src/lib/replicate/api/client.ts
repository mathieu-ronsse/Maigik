import { REPLICATE_API } from './endpoints';
import { logger } from '../../utils/logger';
import { ApiError } from '../../utils/errors/types';

export class ReplicateApiClient {
  constructor(private token: string) {
    if (!token) {
      throw new Error('Replicate API token is required');
    }
  }

  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Token ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      throw new ApiError('Invalid response format from API', response.status);
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new ApiError(
        data.detail || `API request failed: ${response.status}`,
        response.status
      );
    }

    return data;
  }

  async createPrediction<T>(version: string, input: Record<string, unknown>): Promise<T> {
    try {
      logger.debug('Creating prediction:', { version, input });
      
      const response = await fetch(`${REPLICATE_API.BASE_URL}${REPLICATE_API.PREDICTIONS}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ version, input })
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      logger.error('Failed to create prediction:', error);
      throw error;
    }
  }

  async getPrediction<T>(id: string): Promise<T> {
    try {
      const response = await fetch(
        `${REPLICATE_API.BASE_URL}${REPLICATE_API.getPrediction(id)}`,
        {
          headers: this.getHeaders()
        }
      );

      return this.handleResponse<T>(response);
    } catch (error) {
      logger.error('Failed to get prediction:', error);
      throw error;
    }
  }
}