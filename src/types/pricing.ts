export interface PricingTier {
  id: string;
  name: string;
  credits: number;
  price: number;
  features: string[];
  popular?: boolean;
}