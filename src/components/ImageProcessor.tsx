import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from './FileUpload';
import ProcessingStatus from './ProcessingStatus';
import UpscaleControls from './upscale/UpscaleControls';
import { useAuth } from '../contexts/AuthContext';
import { createPrediction, getPrediction } from '../lib/replicate/api/predictions';
import { ServiceId } from '../config/serviceCosts';
import { toast } from 'react-hot-toast';

interface ImageProcessorProps {
  selectedFile: File | null;
  previewUrl: string | null;
  processedImageUrl: string | null;
  serviceId: ServiceId;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
}

export default function ImageProcessor({
  selectedFile,
  previewUrl,
  processedImageUrl,
  serviceId,
  onFileSelect,
  onRemoveFile,
}: ImageProcessorProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scale, setScale] = useState(4);
  const [enhanceFace, setEnhanceFace] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handleProcess = async () => {
    if (!user) {
      toast.error('Please log in to continue');
      return;
    }

    if (!selectedFile || !previewUrl) return;

    try {
      setStatus('uploading');
      setStatusMessage('Starting image processing...');

      // Create prediction
      const prediction = await createPrediction(previewUrl, {
        scale,
        face_enhance: enhanceFace
      });

      setPrediction(prediction);
      setStatus('processing');

      // Poll for results
      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed"
      ) {
        await sleep(1000);
        const updatedPrediction = await getPrediction(prediction.id);
        setPrediction(updatedPrediction);
        setStatusMessage(`Processing: ${updatedPrediction.status}`);

        if (updatedPrediction.status === "failed") {
          throw new Error(updatedPrediction.error || 'Processing failed');
        }
      }

      // Handle success
      if (prediction.output) {
        const outputUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
        setStatus('complete');
        setStatusMessage('Processing complete!');
        onProcessComplete(outputUrl);
      }
    } catch (error) {
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Failed to process image');
      toast.error('Processing failed. Please try again.');
    }
  };

  const onProcessComplete = (outputUrl: string) => {
    // Update the parent component with the processed image URL
    const event = new CustomEvent('processComplete', { detail: { outputUrl } });
    window.dispatchEvent(event);
  };

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <div className="bg-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Your Image</h2>
          <FileUpload onFileSelect={onFileSelect} />
        </div>
      ) : previewUrl && (
        <div className="bg-gray-700/50 rounded-xl p-6">
          <div className="relative">
            <h3 className="text-lg font-medium mb-3">Input Image</h3>
            <button
              onClick={onRemoveFile}
              className="absolute top-2 right-2 p-2 bg-gray-800/80 rounded-full hover:bg-gray-700/80 transition-colors"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
            <img
              src={previewUrl}
              alt="Input preview"
              className="rounded-lg max-h-[300px] object-contain mb-6"
            />
            
            {serviceId === 'upscale' && (
              <UpscaleControls
                scale={scale}
                enhanceFace={enhanceFace}
                onScaleChange={setScale}
                onEnhanceFaceChange={setEnhanceFace}
              />
            )}
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
        <div className="bg-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-3">Result</h3>
          <img
            src={processedImageUrl}
            alt="Processed result"
            className="rounded-lg max-h-[600px] object-contain"
          />
          <a 
            href={processedImageUrl}
            download="processed-image.png"
            className="inline-block mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}