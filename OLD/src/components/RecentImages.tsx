import React from 'react';
import { Image } from 'lucide-react';

export default function RecentImages() {
  return (
    <div className="bg-gray-700/50 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Image className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-semibold">Recent Images</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">No images processed yet</p>
        </div>
      </div>
    </div>
  );
}