import React, { useState, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { services } from '../data/services';
import * as Icons from 'lucide-react';
import ImageProcessor from '../components/ImageProcessor';
import ServiceHeader from '../components/ServiceHeader';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { logServiceUsage } from '../lib/api/service-usage';
import { upscaleImage } from '../lib/api/replicate';
import { uploadFile } from '../lib/api/upload';

export default function ServicePage() {
  const { serviceId } = useParams();
  const service = services.find((s) => s.id === serviceId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!service) {
    return <Navigate to="/" replace />;
  }

  const Icon = Icons[service.icon as keyof typeof Icons];

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedImageUrl(null);
  }, []);

  const handleProcessImage = async () => {
    if (!selectedFile || !user) return;

    setIsProcessing(true);
    const loadingToast = toast.loading('Processing image...');

    try {
      const { url: uploadedUrl } = await uploadFile(selectedFile);

      const usage = await logServiceUsage({
        user_id: user.id,
        service_name: service.id,
        input_image_timestamp: new Date().toISOString(),
        input_image_url: uploadedUrl
      });

      const outputUrl = await upscaleImage(uploadedUrl);
      setProcessedImageUrl(outputUrl);
      
      toast.success('Image processed successfully!', {
        id: loadingToast
      });
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Failed to process image', {
        id: loadingToast
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
      <ServiceHeader
          name={service.name}
          description={service.description}
          icon={Icon}
          serviceId={service.id}
        />
        
        <div className="bg-gray-800 rounded-2xl p-8">
        
          <ImageProcessor
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            processedImageUrl={processedImageUrl}
            isProcessing={isProcessing}
            onFileSelect={handleFileSelect}
            onRemoveFile={handleRemoveFile}
            onProcess={handleProcessImage}
          />
        </div>
      </div>
    </div>
  );
}