export interface ProcessOptions {
  scale?: number;
  face_enhance?: boolean;
}

export interface PredictionOutput {
  outputUrl: string;
}

export interface ProcessResult {
  success: boolean;
  outputUrl?: string;
  error?: string;
}