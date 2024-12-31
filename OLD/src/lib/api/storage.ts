import { supabase } from '../supabase';
import { generateUniqueFileName } from '../utils/files';

export interface UploadResult {
  url: string;
  path: string;
}

export async function uploadImageToStorage(file: File): Promise<UploadResult> {
  const fileName = generateUniqueFileName(file.name);
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error('Error uploading file');
  }

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    path: filePath
  };
}