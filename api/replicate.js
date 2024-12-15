import { createClient } from '@supabase/supabase-js';

const REPLICATE_API_ENDPOINT = 'https://api.replicate.com/v1/predictions';
const REPLICATE_MODEL_VERSION = "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa";

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl } = req.body;

    // Start the processing
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
    const outputUrl = await pollForResult(prediction.id);

    return res.status(200).json({ outputUrl });
  } catch (error) {
    console.error('Processing failed:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process image'
    });
  }
}