export const REPLICATE_API = {
  BASE_URL: '/api',  // Updated to use local proxy
  PREDICTIONS: '/predictions',
  getPrediction: (id: string) => `/predictions/${id}`
} as const;