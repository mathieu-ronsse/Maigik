import React, { useState } from 'react';
import { ImageUp, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import FileUpload from '../components/FileUpload';
import ProcessingStatus from '../components/ProcessingStatus';
import TokenCost from '../components/TokenCost';
import UpscaleForm from '../components/upscale/UpscaleForm';
import { serviceCosts } from '../config/serviceCosts';
import { createUpscalePrediction, getPredictionStatus } from '../lib/api/replicate/upscale';
import { logger } from '../lib/utils/logger';

export default function UpscalePage() {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(2);
  const [enhanceFace, setEnhanceFace] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedImageUrl(null);
    setStatus('idle');
    setStatusMessage('');
  };

  const handleProcess = async () => {
    if (!user) {
      toast.error('Please log in to continue');
      return;
    }

    if (!selectedFile || !previewUrl) return;

    if (!profile || profile.credits < serviceCosts.upscale) {
      toast.error('Not enough credits');
      return;
    }

    try {
      setStatus('uploading');
      setStatusMessage('Starting image processing...');

      const prediction = await createUpscalePrediction(previewUrl, scale, enhanceFace);
      if (!prediction.id) {
        throw new Error('Invalid prediction response');
      }

      setStatus('processing');
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout

      while (attempts < maxAttempts) {
        const updatedPrediction = await getPredictionStatus(prediction.id);
        setStatusMessage(`Processing: ${updatedPrediction.status}`);

        if (updatedPrediction.status === "failed") {
          throw new Error(updatedPrediction.error || 'Processing failed');
        }

        if (updatedPrediction.status === "succeeded") {
          const outputUrl = Array.isArray(updatedPrediction.output) 
            ? updatedPrediction.output[0] 
            : updatedPrediction.output;

          if (!outputUrl) {
            throw new Error('No output URL received');
          }

          setStatus('complete');
          setStatusMessage('Processing complete!');
          setProcessedImageUrl(outputUrl);
          break;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Processing timed out');
      }
    } catch (error) {
      logger.error('Processing failed:', error);
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Failed to process image');
      toast.error('Processing failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <ImageUp className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold">Upscale Image</h1>
        </div>

        {/* Service Info */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8">
          <div className="flex justify-between items-start">
            <div className="text-gray-300">
              Enhance your images with AI-powered upscaling. Increase resolution while maintaining quality.
            </div>
            <TokenCost cost={serviceCosts.upscale} />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800 rounded-2xl p-8">
          <div className="space-y-6">
            {!selectedFile ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Upload Your Image</h2>
                <FileUpload onFileSelect={handleFileSelect} />
              </div>
            ) : previewUrl && (
              <div>
                <div className="relative">
                  <h3 className="text-lg font-medium mb-3">Input Image</h3>
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 p-2 bg-gray-700/80 rounded-full hover:bg-gray-600/80 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-300" />
                  </button>
                  <img
                    src={previewUrl}
                    alt="Input preview"
                    className="rounded-lg max-h-[300px] object-contain mb-6"
                  />
                  
                  <UpscaleForm
                    scale={scale}
                    enhanceFace={enhanceFace}
                    onScaleChange={setScale}
                    onEnhanceFaceChange={setEnhanceFace}
                  />
                </div>
              </div>
            )}

            <ProcessingStatus 
              status={status}
              message={statusMessage}
            />

            <button 
              onClick={handleProcess}
              disabled={!selectedFile || status === 'processing' || status === 'uploading'}
              className={`w-full py-3 rounded-lg transition-colors ${
                selectedFile && status === 'idle'
                  ? 'bg-purple-500 hover:bg-purple-600'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              {status === 'idle' ? 'Process Image' : 'Processing...'}
            </button>

            {processedImageUrl && (
              <div>
                <h3 className="text-lg font-medium mb-3">Result</h3>
                <img
                  src={processedImageUrl}
                  alt="Processed result"
                  className="rounded-lg max-h-[600px] object-contain"
                />
                <a 
                  href={processedImageUrl}
                  download="upscaled-image.png"
                  className="inline-block mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                >
                  Download Image
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}