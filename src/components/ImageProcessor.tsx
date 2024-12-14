import React from 'react';
import { X } from 'lucide-react';
import FileUpload from './FileUpload';
import { toast } from 'react-hot-toast';

interface ImageProcessorProps {
  selectedFile: File | null;
  previewUrl: string | null;
  processedImageUrl: string | null;
  isProcessing: boolean;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
  onProcess: () => Promise<void>;
}

export default function ImageProcessor({
  selectedFile,
  previewUrl,
  processedImageUrl,
  isProcessing,
  onFileSelect,
  onRemoveFile,
  onProcess
}: ImageProcessorProps) {
  const handleProcess = async () => {
    try {
      await onProcess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process image');
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

      <button 
        onClick={handleProcess}
        disabled={!selectedFile || isProcessing}
        className={`w-full py-3 rounded-lg transition-colors ${
          selectedFile && !isProcessing
            ? 'bg-purple-500 hover:bg-purple-600'
            : 'bg-gray-600 cursor-not-allowed'
        }`}
      >
        {isProcessing ? 'Processing...' : 'Process Image'}
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