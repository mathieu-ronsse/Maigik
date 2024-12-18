import React from 'react';
import ServiceCard from '../components/ServiceCard';
import { services } from '../data/services';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
              Transform Your Images with AI
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Unleash the power of artificial intelligence to enhance, modify, and bring your images to life with our suite of creative tools.
            </p>
          </div>

          {/* Header Image */}
          <div className="relative w-full h-[400px] mb-16 rounded-2xl overflow-hidden hidden" >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90 z-10" />
            <img
              src="https://images.unsplash.com/photo-1675271591211-126ad94e495d"
              alt="AI Image Manipulation"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}