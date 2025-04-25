'use client';

import React from 'react';
import { FoodPrint } from '@/lib/foodprintData';
import { X, MapPin } from 'lucide-react';
import LocationActionButtons from '@/components/LocationActionButtons';

interface FoodPrintDetailsPanelProps {
  selectedFoodPrint: FoodPrint | null;
  onClose: () => void;
}

const FoodPrintDetailsPanel: React.FC<FoodPrintDetailsPanelProps> = ({
  selectedFoodPrint,
  onClose,
}) => {
  if (!selectedFoodPrint) {
    return null;
  }

  return (
    <div className="relative flex flex-col h-full w-full overflow-auto bg-white">
      {/* Close button in the top-right corner */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Close details"
      >
        <X className="h-6 w-6 text-gray-700" />
      </button>

      {/* Hero image section */}
      <div className="relative w-full h-[30vh] overflow-hidden">
        <img
          src={selectedFoodPrint.heroImage || '/batchoy-hero.jpg'}
          alt={selectedFoodPrint.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content container */}
      <div className="p-6 flex-1">
        {/* Label - FOODPRINT */}
        <div className="mb-4">
          <span className="bg-yellow-400 px-6 py-2 text-base font-bold uppercase tracking-wide">
            FOODPRINT
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {selectedFoodPrint.name || 'Batchoy Discovery'}
        </h1>

        {/* Location with icon */}
        <div className="flex items-start mb-6">
          <MapPin className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <p className="text-gray-600 ml-2">
            {selectedFoodPrint.location || 'La Paz Public Market, Iloilo City'}
          </p>
        </div>

        {/* Description paragraphs */}
        <div className="space-y-5 mb-10">
          <p className="text-gray-800 leading-relaxed">
            {selectedFoodPrint.description ||
              'Found an amazing Batchoy place near the market.'}
          </p>
          {selectedFoodPrint.extendedDescription?.map((paragraph, idx) => (
            <p key={idx} className="text-gray-800 leading-relaxed">
              {paragraph}
            </p>
          ))}
          {!selectedFoodPrint.extendedDescription && (
            <>
              <p className="text-gray-800 leading-relaxed">
                La Paz Batchoy is an iconic noodle soup that originated from the
                La Paz district of Iloilo City. This hearty dish features a
                rich, flavorful broth made with pork organs, beef, and sometimes
                chicken.
              </p>
              <p className="text-gray-800 leading-relaxed">
                What makes it special are the garnishes: crispy pork cracklings
                (chicharon), fried garlic, spring onions, and a raw egg that
                gets partially cooked when mixed with the hot broth.
              </p>
            </>
          )}
        </div>

        {/* Action buttons using LocationActionButtons component */}
        <LocationActionButtons />
      </div>
    </div>
  );
};

export default FoodPrintDetailsPanel;
