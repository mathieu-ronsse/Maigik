import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileHeader from '../components/ProfileHeader';
import ProfileStats from '../components/ProfileStats';
import ProfileSettings from '../components/ProfileSettings';
import RecentImages from '../components/RecentImages';
import { getUserProfile } from '../lib/database';
import { UserProfile } from '../types/user';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (user) {
      const userProfile = await getUserProfile(user.id);
      setProfile(userProfile);
    }
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-2xl p-8 space-y-6">
          <ProfileHeader 
            profile={profile} 
            userEmail={user.email || ''} 
            createdAt={user.created_at} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileStats profile={profile} />
            <ProfileSettings />
          </div>

          <RecentImages />
        </div>
      </div>
    </div>
  );
}