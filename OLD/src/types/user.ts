export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
}