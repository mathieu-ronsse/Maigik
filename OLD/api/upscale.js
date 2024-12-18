import { createClient } from '@supabase/supabase-js';

const REPLICATE_API_ENDPOINT = 'https://api.replicate.com/v1/predictions';
const REPLICATE_MODEL_VERSION = "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa";

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl } = req.body;

    // Start the upscale process
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
      throw new Error('Failed to start upscale process');
    }

    const prediction = await startResponse.json();
    const result = await pollForResult(prediction.id);

    if (!result.output?.[0]) {
      throw new Error('No output received from upscale process');
    }

    // Download and upload to Supabase
    const outputResponse = await fetch(result.output[0]);
    const outputBlob = await outputResponse.blob();
    const fileName = `upscaled-${Date.now()}.png`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(`outputs/${fileName}`, outputBlob, {
        contentType: 'image/png'
      });

    if (uploadError) {
      throw new Error('Failed to upload processed image');
    }

    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(`outputs/${fileName}`);

    return res.status(200).json({
      outputUrl: urlData.publicUrl
    });
  } catch (error) {
    console.error('Upscale process failed:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process image'
    });
  }
}