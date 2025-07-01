'use client';

import React from 'react';
import Image from 'next/image';
import { FoodPrint } from '@/types/types';
import { Navigation } from 'lucide-react';
import CloseButton from '@/components/buttons/CloseButton';


interface FoodPrintDetailsPanelProps {
  selectedFoodPrint: FoodPrint | null;
  isVisible: boolean;
  onClose: () => void;
}

const FoodPrintDetailsPanel: React.FC<FoodPrintDetailsPanelProps> = ({
  selectedFoodPrint,
  isVisible,
  onClose,
}) => {
  if (!selectedFoodPrint) {
    return null;
  }

  // Use a default image if none is provided
  const imageUrl = selectedFoodPrint.heroImage || '';
  const mapLink = selectedFoodPrint.mapLink || '';

  return (
    <div
      className={`fixed top-0 left-0 w-[300px] min-w-[300px] md:w-[320px] lg:w-[350px] xl:w-[400px] h-full bg-white shadow-lg z-30 transform transition-all duration-500 ease-in-out flex flex-col
        ${isVisible 
          ? 'translate-x-0 scale-100 opacity-100' 
          : '-translate-x-full scale-95 opacity-0'
        }`}
      style={{
        transformOrigin: 'left center'
      }}
    >
      {/* Main image */}
      <div className={`relative h-[30vh] w-full flex-shrink-0 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-80 -translate-y-2'
      }`}> 
        <div className="overflow-hidden h-full w-full">
          <Image
            src={imageUrl}
            alt={selectedFoodPrint.name || 'Food item'}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 25%' }}
            priority
          />
        </div>

        {/* Close button */}
        <CloseButton 
          onClick={onClose} 
          className={`absolute top-4 right-4 transition-all duration-200 hover:scale-110 ${
            isVisible ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
          }`} 
        />
      </div>

      {/* Content wrapper */}
      <div className={`rounded-t-sm -mt-2 relative z-10 bg-white flex-1 overflow-y-auto transition-all duration-400 delay-75 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {/* FOODPRINT Label */}
        <div className={`pt-4 pb-3 px-6 transition-all duration-300 delay-100 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}>
          <span className="inline-block bg-yellow-400 px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-sm">
            FOODPRINT
          </span>
        </div>

        {/* Title */}
        <div className={`px-6 mb-6 transition-all duration-300 delay-150 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {selectedFoodPrint.name || "Siopao"}
          </h1>
        </div>

        {/* Content with drop cap and highlighted sections */}
        <div className={`px-6 space-y-6 pb-32 transition-all duration-400 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* First paragraph with drop cap */}
          <div className="relative">
            <span className="float-left text-6xl font-bold text-gray-900 leading-none mr-3 mt-1">
              {(selectedFoodPrint.name || "Siopao").charAt(0).toUpperCase()}
            </span>
            <p className="text-gray-700 text-base leading-relaxed pt-2">
              {selectedFoodPrint.description ||
                "beloved siopao spot in Iloilo known for its large size and flavorful fillings."}
            </p>
          </div>

          {/* Highlighted quote box */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
            <p className="text-gray-800 text-base leading-relaxed italic">
              {selectedFoodPrint.extendedDescription?.[0] ||
                "A must-visit spot for both locals and tourists, Roberto's has built a strong reputation over the decades for serving siopao that's packed with a rich combination of ingredients — from savory pork and chicken to Chinese sausage and hard-boiled egg."}
            </p>
          </div>

          {/* Location section */}
          {/* <div className="flex items-start mb-6">
            <MapPin className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-gray-600 text-sm font-medium mb-1">Location</p>
              <p className="text-gray-800 text-base leading-relaxed">
                {selectedFoodPrint.location ||
                  'Rizal Street, La Paz Public Market, La Paz, Iloilo City'}
              </p>
            </div>
          </div> */}

          {/* Second highlighted section */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
            <p className="text-gray-800 text-base leading-relaxed italic">
              {selectedFoodPrint.extendedDescription?.[1] ||
                'Their famous "Queen Siopao" stands out as the ultimate indulgence, stuffed with a hefty portion of meat, sausage, and egg, making it a satisfying meal on its own that\'s well worth the experience.'}
            </p>
          </div>

          {/* Additional content if available */}
          {selectedFoodPrint.extendedDescription?.slice(2).map((paragraph, idx) => (
            <p key={idx} className="text-gray-800 text-base leading-relaxed">
              {paragraph}
            </p>
          ))}

          {/* Features/Highlights section */}
          {/* <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">What makes it special</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <span className="text-gray-700 text-sm">Generous size and flavorful fillings</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <span className="text-gray-700 text-sm">Rich combination of premium ingredients</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <span className="text-gray-700 text-sm">Decades of trusted reputation</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Fixed bottom section with gradient fade */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-16 p-6 z-10 transition-all duration-400 delay-250 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <button
          onClick={() => window.open(mapLink, '_blank')}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </button>
      </div>
    </div>
  );
};

export default FoodPrintDetailsPanel;