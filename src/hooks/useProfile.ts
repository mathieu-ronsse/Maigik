import { useState, useEffect } from 'react';
import { UserProfile } from '../types/user';
import { getUserProfile } from '../lib/api/profile';

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!userId) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const data = await getUserProfile(userId);
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load profile'));
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId]);

  return { profile, loading, error, setProfile };
}