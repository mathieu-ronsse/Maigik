import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getUserProfile, updateUserProfile } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types/user';

export default function ProfileSettings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (user) {
      const userProfile = await getUserProfile(user.id);
      setProfile(userProfile);
      setDisplayName(userProfile?.display_name || '');
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const updated = await updateUserProfile(user.id, {
        display_name: displayName
      });

      if (updated) {
        setProfile(updated);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="bg-gray-700/50 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Display Name
          </label>
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">
                {profile?.display_name || 'Not set'}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition-colors"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}