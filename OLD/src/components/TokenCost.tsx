import React from 'react';
import { Coins } from 'lucide-react';

interface TokenCostProps {
  cost: number;
}

export default function TokenCost({ cost }: TokenCostProps) {
  return (
    <div className="flex items-center gap-2 text-purple-400">
      <span>Cost:</span>
      <div className="flex items-center gap-1">
        <span>{cost}</span>
        <Coins className="w-4 h-4" />
      </div>
    </div>
  );
}