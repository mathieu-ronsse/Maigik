import { getEnvVar } from '../config/environment.js';
import { ApiError } from '../utils/error.js';
import { validateImageUrl } from '../utils/validation.js';

const REPLICATE_API_ENDPOINT = 'https://api.replicate.com/v1/predictions';
const MODEL_VERSION = "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa";
const MAX_ATTEMPTS = 30;
const POLLING_INTERVAL = 2000;

async function pollForResult(predictionId) {
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    const response = await fetch(`${REPLICATE_API_ENDPOINT}/${predictionId}`, {
      headers: {
        'Authorization': `Token ${getEnvVar('REPLICATE_API_TOKEN')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError('Failed to check prediction status', response.status);
    }

    const prediction = await response.json();
    console.log('Prediction status:', prediction.status);

    if (prediction.status === 'succeeded') {
      // Handle both single URL and array outputs
      const output = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
      return output;
    }

    if (prediction.status === 'failed') {
      throw new ApiError(prediction.error || 'Image processing failed', 500);
    }

    await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
    attempts++;
  }

  throw new ApiError('Processing timed out', 504);
}

export async function processImage(imageUrl) {
  try {
    validateImageUrl(imageUrl);

    // Start the prediction
    const response = await fetch(REPLICATE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${getEnvVar('REPLICATE_API_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          image: imageUrl,
          scale: 2
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.detail || 'Failed to start processing', response.status);
    }

    const prediction = await response.json();
    console.log('Started prediction:', prediction.id);

    // Poll for the result
    const outputUrl = await pollForResult(prediction.id);
    console.log('Processing complete:', outputUrl);

    return outputUrl;
  } catch (error) {
    console.error('Replicate API error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      error.message || 'Failed to process image with Replicate API',
      error.response?.status || 500
    );
  }
}