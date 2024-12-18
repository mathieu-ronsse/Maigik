import { useState } from 'react';

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'saving' | 'complete' | 'error';

interface ProcessingState {
  status: ProcessingStatus;
  message: string;
}

export function useProcessingState() {
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle',
    message: ''
  });

  return {
    processingState,
    setProcessingState
  };
}