import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from './FileUpload';
import ProcessingStatus from './ProcessingStatus';
import { useAuth } from '../contexts/AuthContext';
import { useImageProcessing } from '../hooks/useImageProcessing';
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
  const { processImage, processingState } = useImageProcessing(serviceId);
  const navigate = useNavigate();

  const handleProcess = async () => {
    if (!user) {
      toast.error('Please log in to continue');
      return;
    }

    if (!selectedFile) return;

    const outputUrl = await processImage(selectedFile);
    if (outputUrl) {
      toast.success('Image processed successfully!');
    }
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
              className="rounded-lg max-h-[300px] object-contain"
            />
          </div>
        </div>
      )}

      <ProcessingStatus 
        status={processingState.status} 
        message={processingState.message} 
      />

      <button 
        onClick={handleProcess}
        disabled={!selectedFile || processingState.status !== 'idle'}
        className={`w-full py-3 rounded-lg transition-colors ${
          selectedFile && processingState.status === 'idle'
            ? 'bg-purple-500 hover:bg-purple-600'
            : 'bg-gray-600 cursor-not-allowed'
        }`}
      >
        {processingState.status === 'idle' ? 'Process Image' : 'Processing...'}
      </button>

      {processedImageUrl && (
        <div className="bg-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-3">Output Image</h3>
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