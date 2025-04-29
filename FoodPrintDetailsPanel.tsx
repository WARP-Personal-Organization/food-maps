'use client';

import React from 'react';
import { FoodPrint } from '@/lib/foodprintData';
import { X, MapPin, Calendar } from 'lucide-react';
import LocationActionButtons from '@/components/LocationActionButtons';

interface FoodPrintDetailsPanelProps {
  selectedFoodPrint: FoodPrint | null;
  onClose: () => void;
}

const FoodPrintDetailsPanel: React.FC<FoodPrintDetailsPanelProps> = ({
  selectedFoodPrint,
  onClose,
}) => {
  if (!selectedFoodPrint) return null;

  return (
    <div className="relative flex flex-col h-full w-full overflow-auto bg-white">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Close details"
        tabIndex={0}
      >
        <X className="h-6 w-6 text-gray-700" />
      </button>

      {/* Hero image */}
      <div className="relative w-full h-[30vh] overflow-hidden">
        <img
          src={selectedFoodPrint.heroImage || '/batchoy-hero.jpg'}
          alt={selectedFoodPrint.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex-1">
        {/* Label - FOODPRINT */}
        <div className="mb-4">
          <span className="bg-yellow-400 px-6 py-2 text-base font-bold uppercase tracking-wide">
            FOODPRINT
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {selectedFoodPrint.name}
        </h1>

        {/* Location with icon */}
        <div className="flex items-start mb-4">
          <MapPin className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <p className="text-gray-600 ml-2">
            {selectedFoodPrint.location || 'Location not available'}
          </p>
        </div>

        {/* Date visited (if available) */}
        {selectedFoodPrint.dateVisited && (
          <div className="flex items-start mb-6">
            <Calendar className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600 ml-2">
              Visited on{' '}
              {new Date(selectedFoodPrint.dateVisited).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Description paragraphs */}
        <div className="space-y-5 mb-10">
          <p className="text-gray-800 leading-relaxed">
            {selectedFoodPrint.description}
          </p>
          {selectedFoodPrint.extendedDescription?.map((paragraph, idx) => (
            <p key={idx} className="text-gray-800 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Action buttons */}
        <LocationActionButtons />
      </div>
    </div>
  );
};

export default FoodPrintDetailsPanel;
