export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

export interface ProcessImageResponse {
  outputUrl: string;
}