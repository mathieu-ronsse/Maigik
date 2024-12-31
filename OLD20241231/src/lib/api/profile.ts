import { supabase } from '../supabase';
import { UserProfile } from '../../types/user';

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('getUserProfile error:', error);
    throw error;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('updateUserProfile error:', error);
    throw error;
  }
}

export async function ensureUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    // First check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw fetchError;
    }

    if (existingProfile) {
      return existingProfile;
    }

    // Create new profile if none exists
    const { data: newProfile, error: insertError } = await supabase
      .from('user_profiles')
      .insert([
        {
          user_id: userId,
          display_name: null,
          credits: 0
        }
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return newProfile;
  } catch (error) {
    console.error('ensureUserProfile error:', error);
    throw error;
  }
}