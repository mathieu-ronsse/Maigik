import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from './useProfile';
import { useProcessingState } from './useProcessingState';
import { useCreditCheck } from './useCreditCheck';
import { uploadImageToStorage } from '../lib/api/storage';
import { logServiceUsage, updateServiceUsage } from '../lib/api/service-usage';
import { serviceCosts } from '../config/serviceCosts';
import { processImage } from '../lib/replicate/service';
import { ServiceId } from '../config/serviceCosts';
import { logger } from '../utils/logger';

interface ProcessingOptions {
  scale?: number;
  face_enhance?: boolean;
}

export function useImageProcessing(serviceId: ServiceId) {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const { processingState, setProcessingState } = useProcessingState();
  const { checkCredits } = useCreditCheck(serviceId);

  const processUserImage = async (file: File, options: ProcessingOptions = {}): Promise<string | null> => {
    if (!checkCredits(profile?.credits) || !user) return null;

    try {
      // Upload original image
      setProcessingState({ status: 'uploading', message: 'Uploading image...' });
      const { url: inputUrl } = await uploadImageToStorage(file);

      // Log service usage
      const usage = await logServiceUsage({
        user_id: user.id,
        service_name: serviceId,
        input_image_timestamp: new Date().toISOString(),
        input_image_url: inputUrl,
        tokens_deducted: serviceCosts[serviceId]
      });

      // Process with Replicate
      setProcessingState({ status: 'processing', message: 'Processing image...' });
      const result = await processImage(inputUrl, options);

      if (!result.success || !result.outputUrl) {
        throw new Error(result.error || 'Processing failed');
      }

      // Update service usage with result
      setProcessingState({ status: 'saving', message: 'Saving result...' });
      await updateServiceUsage(usage.id!, {
        output_image_timestamp: new Date().toISOString(),
        output_image_url: result.outputUrl
      });

      setProcessingState({ status: 'complete', message: 'Processing complete!' });
      return result.outputUrl;
    } catch (error) {
      logger.error('Image processing failed:', error);
      setProcessingState({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'An error occurred' 
      });
      return null;
    }
  };

  return {
    processImage: processUserImage,
    processingState
  };
}