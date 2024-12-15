import { useState, useEffect } from 'react';
import { UserProfile } from '../types/user';
import { getUserProfile } from '../lib/api/profile';

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!userId) {
        if (mounted) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const data = await getUserProfile(userId);
        if (mounted) {
          setProfile(data);
          setError(null);
        }
      } catch (err) {
        console.error('Profile loading error:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load profile'));
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [userId]);

  return { profile, loading, error, setProfile };
}