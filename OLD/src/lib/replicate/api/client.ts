import { REPLICATE_API } from './endpoints';
import { logger } from '../../utils/logger';
import { ApiError } from '../../utils/errors/types';

export class ReplicateApiClient {
  private token: string;
  
  constructor(token: string) {
    if (!token) {
      throw new Error('Replicate API token is required');
    }
    this.token = token;
  }

  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Token ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || `API request failed: ${response.status}`,
        response.status
      );
    }

    return response.json();
  }

  async createPrediction<T>(version: string, input: Record<string, unknown>): Promise<T> {
    logger.debug('Creating prediction:', { version, input });
    
    const response = await fetch(`${REPLICATE_API.BASE_URL}${REPLICATE_API.PREDICTIONS}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ version, input })
    });

    return this.handleResponse<T>(response);
  }

  async getPrediction<T>(id: string): Promise<T> {
    const response = await fetch(
      `${REPLICATE_API.BASE_URL}${REPLICATE_API.getPrediction(id)}`,
      {
        headers: this.getHeaders()
      }
    );

    return this.handleResponse<T>(response);
  }
}

export const createReplicateClient = () => {
  const token = import.meta.env.VITE_REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error('VITE_REPLICATE_API_TOKEN environment variable is not set');
  }
  return new ReplicateApiClient(token);
};