import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  maxSize?: number;
}

export default function FileUpload({ 
  onFileSelect,
  maxSize = 5 * 1024 * 1024 // 5MB default
}: FileUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    onFileSelect(acceptedFiles[0]);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false,
    maxSize
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
        ${isDragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 hover:border-purple-500/50'}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-8 h-8 text-purple-400 mx-auto mb-4" />
      {isDragActive ? (
        <p className="text-purple-400">Drop your image here</p>
      ) : (
        <div className="space-y-2">
          <p className="text-gray-300">Drag and drop your image here</p>
          <p className="text-gray-400 text-sm">or click to select a file</p>
          <p className="text-gray-400 text-xs">
            Maximum file size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
          </p>
        </div>
      )}
    </div>
  );
}