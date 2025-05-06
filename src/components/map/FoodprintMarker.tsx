'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FoodPrint } from '@/types/types';

interface FoodprintMarkerProps {
  foodprint: FoodPrint;
  onClick: (foodprint: FoodPrint) => void;
}

export const FoodprintMarker = ({
  foodprint,
  onClick,
}: FoodprintMarkerProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onClick(foodprint);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick(foodprint);
    }
  };

  const getMarkerSize = () => {
    return 'w-10 h-10';
  };

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
        isHovered ? 'scale-110 z-10' : 'z-5'
      }`}
      style={{ left: foodprint.x, top: foodprint.y }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={`View foodprint details for ${foodprint.name}`}
    >
      <div className={`${getMarkerSize()} relative`}>
        <Image
          src={foodprint.iconUrl}
          alt="Foodprint marker"
          fill
          className="object-contain"
        />
      </div>

      {isHovered && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap z-20">
          {foodprint.name}
        </div>
      )}
    </div>
  );
};
