import { supabase } from '../supabase';

export interface ServiceUsage {
  id?: string;
  user_id: string;
  service_name: string;
  input_image_timestamp: string;
  input_image_url: string;
  output_image_timestamp?: string;
  output_image_url?: string;
  tokens_deducted?: number;
}

export async function logServiceUsage(usage: Omit<ServiceUsage, 'id'>): Promise<ServiceUsage> {
  try {
    const { data, error } = await supabase
      .from('service_usage')
      .insert([{
        ...usage,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Service usage logging error:', error);
      throw new Error(`Failed to log service usage: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Service usage logging error:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to log service usage');
  }
}

export async function updateServiceUsage(
  id: string,
  updates: Partial<ServiceUsage>
): Promise<ServiceUsage> {
  try {
    const { data, error } = await supabase
      .from('service_usage')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Service usage update error:', error);
      throw new Error(`Failed to update service usage: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Service usage update error:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to update service usage');
  }
}