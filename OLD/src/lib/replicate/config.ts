import { getEnvVar } from '../config/env';

export const REPLICATE_CONFIG = {
  token: getEnvVar('REPLICATE_API_TOKEN'),
  models: {
    upscale: {
      id: 'nightmareai/real-esrgan',
      version: 'f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa',
      defaultOptions: {
        scale: 2,
        face_enhance: false
      }
    }
  }
} as const;