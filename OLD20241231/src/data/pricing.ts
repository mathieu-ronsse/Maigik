import { PricingTier } from '../types/pricing';

export const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 100,
    price: 9.99,
    features: [
      '100 AI Image Processing Credits',
      'Basic Support',
      '720p Max Resolution',
      'Standard Processing Speed'
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    credits: 500,
    price: 29.99,
    popular: true,
    features: [
      '500 AI Image Processing Credits',
      'Priority Support',
      '4K Max Resolution',
      'Fast Processing Speed',
      'Batch Processing'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 2000,
    price: 99.99,
    features: [
      '2000 AI Image Processing Credits',
      '24/7 Premium Support',
      '8K Max Resolution',
      'Ultra-Fast Processing Speed',
      'Batch Processing',
      'API Access'
    ]
  }
];