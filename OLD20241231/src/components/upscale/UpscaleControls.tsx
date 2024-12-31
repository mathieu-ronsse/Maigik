import React from 'react';

interface UpscaleControlsProps {
  scale: number;
  enhanceFace: boolean;
  onScaleChange: (scale: number) => void;
  onEnhanceFaceChange: (enhance: boolean) => void;
}

export default function UpscaleControls({
  scale,
  enhanceFace,
  onScaleChange,
  onEnhanceFaceChange
}: UpscaleControlsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Scale {scale}X
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={scale}
          onChange={(e) => onScaleChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enhanceFace"
          checked={enhanceFace}
          onChange={(e) => onEnhanceFaceChange(e.target.checked)}
          className="w-4 h-4 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
        />
        <label htmlFor="enhanceFace" className="ml-2 text-sm font-medium text-gray-300">
          Enhance face
        </label>
      </div>
    </div>
  );
}