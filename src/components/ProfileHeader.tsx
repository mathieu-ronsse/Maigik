import React from 'react';
import { User } from 'lucide-react';
import { UserProfile } from '../types/user';

interface ProfileHeaderProps {
  profile: UserProfile | null;
  userEmail: string;
  createdAt: string;
}

export default function ProfileHeader({ profile, userEmail, createdAt }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center">
        <User size={32} className="text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{profile?.display_name || userEmail}</h1>
        <p className="text-gray-400">Member since {new Date(createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}