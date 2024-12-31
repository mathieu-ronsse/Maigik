export const REPLICATE_API = {
  BASE_URL: 'https://api.replicate.com/v1',
  PREDICTIONS: '/predictions',
  getPrediction: (id: string) => `/predictions/${id}`
} as const;