import { supabase } from './supabase';
import { UserProfile } from '../types/user';

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export async function updateUserProfile(
  userId: string,
  updates: { display_name: string }
) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  return data;
}

// This function will now check if a profile exists before creating one
export async function createUserProfile(userId: string): Promise<UserProfile | null> {
  // First check if profile already exists
  const existingProfile = await getUserProfile(userId);
  if (existingProfile) {
    return existingProfile;
  }

  // Only create if no profile exists
  const { data, error } = await supabase
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

  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }

  return data;
}