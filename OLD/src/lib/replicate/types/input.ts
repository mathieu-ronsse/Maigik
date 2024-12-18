export interface UpscaleInput {
  image: string;
  scale?: number;
  face_enhance?: boolean;
}

export interface ProcessOptions {
  scale?: number;
  face_enhance?: boolean;
}