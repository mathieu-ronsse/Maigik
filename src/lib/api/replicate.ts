import { supabase } from '../supabase';
import { uploadImageToStorage } from './storage';

const REPLICATE_API_ENDPOINT = 'https://api.replicate.com/v1/predictions';

interface ReplicateResponse {
  id: string;
  status: string;
  output: string[] | null;
  error: string | null;
}

export async function upscaleImage(imageUrl: string): Promise<string> {
  try {
    // Initial API call to start the prediction
    const response = await fetch(REPLICATE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${import.meta.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
        input: {
          image: imageUrl,
          scale: 2
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to start upscale process');
    }

    const prediction = await response.json();
    
    // Poll for results
    const result = await pollForResult(prediction.id);
    
    if (!result.output || !result.output[0]) {
      throw new Error('No output received from upscale process');
    }

    // Download the result image
    const outputResponse = await fetch(result.output[0]);
    const outputBlob = await outputResponse.blob();
    const outputFile = new File([outputBlob], 'upscaled.png', { type: 'image/png' });

    // Upload the result to Supabase storage
    const { url: outputUrl } = await uploadImageToStorage(outputFile);
    
    return outputUrl;
  } catch (error) {
    console.error('Upscale process failed:', error);
    throw error;
  }
}

async function pollForResult(predictionId: string): Promise<ReplicateResponse> {
  const maxAttempts = 30;
  const pollingInterval = 1000;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(`${REPLICATE_API_ENDPOINT}/${predictionId}`, {
      headers: {
        'Authorization': `Token ${import.meta.env.REPLICATE_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check prediction status');
    }

    const prediction = await response.json();

    if (prediction.status === 'succeeded') {
      return prediction;
    }

    if (prediction.status === 'failed') {
      throw new Error(prediction.error || 'Upscale process failed');
    }

    await new Promise(resolve => setTimeout(resolve, pollingInterval));
    attempts++;
  }

  throw new Error('Timeout waiting for upscale result');
}