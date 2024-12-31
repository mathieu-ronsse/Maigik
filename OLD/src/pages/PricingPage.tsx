import React from 'react';
import { Check } from 'lucide-react';
import { pricingTiers } from '../data/pricing';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import TokenDisplay from '../components/TokenDisplay';

export default function PricingPage() {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);

  const handlePurchase = (tierId: string) => {
    // TODO: Implement Stripe integration
    console.log('Purchase credits:', tierId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <TokenDisplay profile={profile} variant="large" />

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Buy Extra Credits</h1>
          <p className="text-xl text-gray-400">Choose the perfect plan for your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`bg-gray-800 rounded-2xl p-8 relative ${
                tier.popular ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">${tier.price}</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(tier.id)}
                className={`w-full py-3 rounded-lg transition-colors ${
                  tier.popular
                    ? 'bg-purple-500 hover:bg-purple-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                } text-white`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}