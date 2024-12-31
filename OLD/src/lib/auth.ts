import { supabase } from './supabase';
import { createUserProfile } from './database';

export async function signInWithEmail(email: string, password: string) {
  const { error, data } = await supabase.auth.signInWithPassword({ 
    email, 
    password 
  });
  
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  const { error, data } = await supabase.auth.signUp({ 
    email, 
    password 
  });
  
  if (error) throw error;
  
  if (data.user) {
    await createUserProfile(data.user.id);
  }
  
  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}