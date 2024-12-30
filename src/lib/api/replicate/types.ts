export interface Prediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed';
  output?: string | string[];
  error?: string;
}

export interface PredictionResponse {
  success: boolean;
  prediction?: Prediction;
  error?: string;
}