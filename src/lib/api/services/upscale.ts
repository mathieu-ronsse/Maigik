import { uploadImageToStorage } from '../storage';
import { updateServiceUsage } from '../service-usage';
import { createServerApi } from '../server';

const api = createServerApi();

interface UpscaleResult {
  outputUrl: string;
}

export async function processUpscaleImage(
  imageUrl: string, 
  usageId: string
): Promise<UpscaleResult> {
  try {
    // Call our backend API endpoint
    const response = await api.post('/upscale', {
      imageUrl,
      usageId
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to process image');
    }

    const result = await response.json();

    // Update service usage with the result
    await updateServiceUsage(usageId, {
      output_image_timestamp: new Date().toISOString(),
      output_image_url: result.outputUrl
    });

    return result;
  } catch (error) {
    console.error('Upscale process failed:', error);
    throw error;
  }
}