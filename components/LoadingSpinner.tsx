
import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner: React.FC = () => {
  return (
    <FaSpinner className="animate-spin h-5 w-5 text-white" />
  );
};

export default LoadingSpinner;
