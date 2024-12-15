import { REPLICATE_API_ENDPOINT, REPLICATE_MODEL_VERSION } from '../config/constants.js';

async function pollForResult(predictionId) {
  const maxAttempts = 30;
  const pollingInterval = 1000;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(`${REPLICATE_API_ENDPOINT}/${predictionId}`, {
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check prediction status');
    }

    const prediction = await response.json();

    if (prediction.status === 'succeeded') {
      return prediction.output[0];
    }

    if (prediction.status === 'failed') {
      throw new Error(prediction.error || 'Processing failed');
    }

    await new Promise(resolve => setTimeout(resolve, pollingInterval));
    attempts++;
  }

  throw new Error('Timeout waiting for processing result');
}

export async function processImage(imageUrl) {
  const startResponse = await fetch(REPLICATE_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: REPLICATE_MODEL_VERSION,
      input: {
        image: imageUrl,
        scale: 2
      }
    })
  });

  if (!startResponse.ok) {
    throw new Error('Failed to start processing');
  }

  const prediction = await startResponse.json();
  return pollForResult(prediction.id);
}