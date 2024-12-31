import React from 'react';
import { Coins } from 'lucide-react';
import { UserProfile } from '../types/user';

interface ProfileStatsProps {
  profile: UserProfile | null;
}

export default function ProfileStats({ profile }: ProfileStatsProps) {
  return (
    <div className="bg-gray-700/50 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Coins className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-semibold">Credits</h2>
      </div>
      <p className="text-3xl font-bold text-purple-400">{profile?.credits || 0}</p>
      <p className="text-gray-400 mt-2">Available credits</p>
    </div>
  );
}