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
      throw new Error(`Failed to check prediction status: ${response.status}`);
    }

    const prediction = await response.json();
    console.debug('Prediction status:', prediction);

    if (prediction.status === 'succeeded') {
      return prediction.output;
    }

    if (prediction.status === 'failed') {
      throw new Error(prediction.error || 'Processing failed');
    }

    await new Promise(resolve => setTimeout(resolve, pollingInterval));
    attempts++;
  }

  throw new Error('Timeout waiting for processing result');
}

export async function processImage(imageUrl, options = {}) {
  console.debug('Processing image:', { imageUrl, options });

  const payload = {
    version: REPLICATE_MODEL_VERSION,
    input: {
      image: imageUrl,
      scale: options.scale || 2,
      face_enhance: options.face_enhance || false
    }
  };

  console.debug('Replicate payload:', payload);

  const response = await fetch(REPLICATE_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || `Failed to start prediction: ${response.status}`);
  }

  const prediction = await response.json();
  console.debug('Started prediction:', prediction);

  const output = await pollForResult(prediction.id);
  const outputUrl = Array.isArray(output) ? output[0] : output;

  return { outputUrl };
}