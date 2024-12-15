import { createServerApi } from './server';

const api = createServerApi();

export async function processWithReplicate(imageUrl: string): Promise<string> {
  try {
    const response = await api.post('/replicate', {
      imageUrl
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Processing failed');
    }

    const result = await response.json();
    return result.outputUrl;
  } catch (error) {
    console.error('Replicate processing failed:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to process image');
  }
}