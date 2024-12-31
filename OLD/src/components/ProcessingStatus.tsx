import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  status: 'idle' | 'uploading' | 'processing' | 'saving' | 'complete' | 'error';
  message: string;
}

export default function ProcessingStatus({ status, message }: ProcessingStatusProps) {
  if (status === 'idle') return null;

  const isLoading = ['uploading', 'processing', 'saving'].includes(status);
  const bgColor = status === 'error' ? 'bg-red-500/10' : 'bg-purple-500/10';
  const textColor = status === 'error' ? 'text-red-400' : 'text-purple-400';

  return (
    <div className={`${bgColor} rounded-lg p-4 flex items-center gap-3 my-4`}>
      {isLoading && (
        <Loader2 className={`w-5 h-5 ${textColor} animate-spin`} />
      )}
      <span className={textColor}>{message}</span>
    </div>
  );
}