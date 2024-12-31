import { Handler } from '@netlify/functions';
import { createPrediction, getPrediction } from '../../src/lib/replicate/api/predictions';
import { logger } from '../../src/lib/utils/logger';

export const handler: Handler = async (event) => {
  try {
    // Handle GET request for prediction status
    if (event.httpMethod === 'GET') {
      const predictionId = event.path.split('/').pop();
      if (!predictionId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Prediction ID is required' })
        };
      }

      const prediction = await getPrediction(predictionId);
      return {
        statusCode: 200,
        body: JSON.stringify(prediction)
      };
    }

    // Handle POST request for new prediction
    if (event.httpMethod === 'POST') {
      const { imageUrl, scale, face_enhance } = JSON.parse(event.body || '{}');
      const prediction = await createPrediction(imageUrl, { scale, face_enhance });
      return {
        statusCode: 201,
        body: JSON.stringify(prediction)
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    logger.error('Prediction error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      })
    };
  }
}