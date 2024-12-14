import React from 'react';
import { Coins } from 'lucide-react';
import { UserProfile } from '../types/user';

interface TokenDisplayProps {
  profile: UserProfile | null;
  variant?: 'header' | 'large';
}

export default function TokenDisplay({ profile, variant = 'header' }: TokenDisplayProps) {
  if (variant === 'large') {
    return (
      <div className="bg-gray-800 rounded-2xl p-8 text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Coins className="w-8 h-8 text-purple-400" />
          <h2 className="text-2xl font-bold">Your Credits</h2>
        </div>
        <p className="text-4xl font-bold text-purple-400 mb-2">
          {profile?.credits || 0}
        </p>
        <p className="text-gray-400">Available credits</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Coins className="w-5 h-5 text-purple-400" />
      <span className="text-gray-200">{profile?.credits || 0}</span>
    </div>
  );
}