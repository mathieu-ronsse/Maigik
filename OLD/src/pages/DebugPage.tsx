import React, { useState } from 'react';
import { logger } from '../utils/logger';

const MODEL = "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa";

export default function DebugPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [scale, setScale] = useState(2);
  const [faceEnhance, setFaceEnhance] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setApiResponse(null);

    const input = {
      image: imageUrl,
      scale,
      face_enhance: faceEnhance
    };

    try {
      logger.debug('Sending request to Replicate API:', {
        model: MODEL,
        input
      });

      const response = await fetch('/api/replicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          model: MODEL, 
          input 
        }),
      });

      const data = await response.json();
      logger.debug('Received response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

      setApiResponse(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      logger.error('API call failed:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Replicate API Debug</h1>

        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Model Information</h2>
          <code className="text-sm text-gray-300">{MODEL}</code>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Scale ({scale}x)</label>
            <input
              type="range"
              min="1"
              max="4"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="faceEnhance"
              checked={faceEnhance}
              onChange={(e) => setFaceEnhance(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="faceEnhance" className="text-sm font-medium">
              Face Enhancement
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-600 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Process Image'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {apiResponse && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">API Response:</h2>
            <pre className="p-4 bg-gray-800 rounded-lg overflow-x-auto">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>

            {apiResponse.output && (
              <div>
                <h3 className="text-lg font-medium mb-2">Processed Image:</h3>
                <img
                  src={apiResponse.output}
                  alt="Processed result"
                  className="rounded-lg max-w-full"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}