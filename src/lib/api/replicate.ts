import { createServerApi } from './server';
import { handleApiError } from '../../utils/api/errors';

const api = createServerApi();

export async function processWithReplicate(imageUrl: string): Promise<string> {
  try {
    const response = await api.post('/replicate', { imageUrl });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Processing failed: ${response.statusText}`);
    }

    if (!data.outputUrl) {
      throw new Error('No output URL received from processing');
    }

    return data.outputUrl;
  } catch (error) {
    console.error('Replicate processing failed:', error);
    throw handleApiError(error);
  }
}