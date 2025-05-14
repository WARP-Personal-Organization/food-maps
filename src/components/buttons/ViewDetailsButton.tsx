import React from 'react';

interface ViewDetailsButtonProps {
  onClick?: () => void;
  className?: string;
}

const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      aria-label="View Details"
      className={`font-bold rounded-sm h-12 flex items-center justify-center ${className}`}
    >
      <span>View Details</span>
    </button>
  );
}

export default ViewDetailsButton;