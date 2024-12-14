import React, { useState, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { services } from '../data/services';
import * as Icons from 'lucide-react';
import ImageProcessor from '../components/ImageProcessor';
import ServiceHeader from '../components/ServiceHeader';
import { ServiceId } from '../config/serviceCosts';

export default function ServicePage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = services.find((s) => s.id === serviceId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  
  if (!service || !serviceId) {
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

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ServiceHeader
          name={service.name}
          description={service.description}
          icon={Icon}
          serviceId={service.id as ServiceId}
        />
        
        <div className="bg-gray-800 rounded-2xl p-8">
          <ImageProcessor
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            processedImageUrl={processedImageUrl}
            serviceId={service.id as ServiceId}
            onFileSelect={handleFileSelect}
            onRemoveFile={handleRemoveFile}
          />
        </div>
      </div>
    </div>
  );
}