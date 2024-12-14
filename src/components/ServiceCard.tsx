import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Service } from '../types/service';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const navigate = useNavigate();
  const Icon = Icons[service.icon as keyof typeof Icons];

  return (
    <div
      onClick={() => navigate(`/services/${service.id}`)}
      className="group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
      <img
        src={service.imageUrl}
        alt={service.name}
        className="w-full h-64 object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">{service.name}</h3>
        </div>
        <p className="text-gray-300 text-sm">{service.description}</p>
      </div>
    </div>
  );
}