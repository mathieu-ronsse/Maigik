import { supabase } from '../supabase';

export interface UploadResponse {
  url: string;
  path: string;
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  try {
    // Validate file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error('File size exceeds 5MB limit');
    }

    // Generate a unique file name
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${random}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    if (!urlData.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    return {
      url: urlData.publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Upload function error:', error);
    throw error instanceof Error 
      ? error 
      : new Error('An unexpected error occurred during upload');
  }
}