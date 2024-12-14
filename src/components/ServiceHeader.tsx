import React from 'react';
import { LucideIcon } from 'lucide-react';
import TokenCost from './TokenCost';
import { serviceCosts } from '../config/serviceCosts';

interface ServiceHeaderProps {
  name: string;
  description: string;
  icon: LucideIcon;
  serviceId: string;
}

export default function ServiceHeader({ name, description, icon: Icon, serviceId }: ServiceHeaderProps) {
  const cost = serviceCosts[serviceId as keyof typeof serviceCosts] || 1;

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <Icon className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl font-bold">{name}</h1>
      </div>
      
      <div className="bg-gray-800 rounded-2xl p-8">
        <div className="flex justify-between items-start">
          <div className="text-gray-300">{description}</div>
          <TokenCost cost={cost} />
        </div>
      </div>
      <br/>
    </>
  );
}