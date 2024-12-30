export interface Prediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed';
  created_at?: string;
  output?: string | string[];
  error?: string;
}

export interface PredictionResponse {
  success: boolean;
  prediction?: Prediction;
  error?: string;
}