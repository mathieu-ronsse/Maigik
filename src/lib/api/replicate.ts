const REPLICATE_API_ENDPOINT = 'https://api.replicate.com/v1/predictions';
const REPLICATE_MODEL_VERSION = "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa";

async function pollForResult(predictionId: string): Promise<string> {
  const maxAttempts = 30;
  const pollingInterval = 1000;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(`${REPLICATE_API_ENDPOINT}/${predictionId}`, {
      headers: {
        'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
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

export async function processWithReplicate(imageUrl: string): Promise<string> {
  const response = await fetch(REPLICATE_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
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

  if (!response.ok) {
    throw new Error('Failed to start processing');
  }

  const prediction = await response.json();
  return pollForResult(prediction.id);
}