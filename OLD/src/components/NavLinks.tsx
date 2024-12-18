import React from 'react';
import { Link } from 'react-router-dom';

export default function NavLinks() {
  return (
    <>
      <Link 
        to="/pricing" 
        className="text-gray-300 hover:text-white transition-colors"
      >
        Pricing
      </Link>
    </>
  );
}