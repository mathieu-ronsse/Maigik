import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { serviceCosts, ServiceId } from '../config/serviceCosts';
import React from 'react'; // Import React to use React.createElement

export function useCreditCheck(serviceId: ServiceId) {
  const navigate = useNavigate();
  const requiredCredits = serviceCosts[serviceId];

  const checkCredits = (userCredits: number | undefined): boolean => {
    if (typeof userCredits === 'undefined') {
      toast.error('Unable to verify credits. Please try again.');
      return false;
    }

    if (userCredits < requiredCredits) {
      toast.error(
        React.createElement(
          'div',
          { className: 'flex flex-col gap-2' },
          React.createElement('span', null, 'Not enough credits'),
          React.createElement(
            'button',
            {
              onClick: () => navigate('/pricing'),
              className: 'bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors',
            },
            'Get more credits'
          )
        ),
        { duration: 5000 }
      );
      return false;
    }

    return true;
  };

  return { checkCredits };
}