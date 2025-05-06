'use client';

import React from 'react';
import Image from 'next/image';
import { FoodPrint } from '@/types/types';
import { MapPin } from 'lucide-react';
import LocationActionButtons from '@/components/LocationActionButtons';
import CloseButton from "@/components/buttons/CloseButton";

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
  const imageUrl = selectedFoodPrint.heroImage || '/images/robertos/r1.webp';

  return (
    <div
      className={`fixed top-0 left-0 w-[35vh] h-full bg-white shadow-lg z-50 transform transition-transform duration-300 
        ${isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* Main image - matching the reference image */}
      <div className="relative h-[30vh] w-full">
        <div className="overflow-hidden h-full w-full">
          <Image
            src={imageUrl}
            alt={selectedFoodPrint.name || 'Food item'}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 25%' }}
            priority
          />
        </div>

        {/* Close button in the top-right corner */}
        <CloseButton onClick={onClose} className="absolute top-4 right-4" />
      </div>

      {/* Content wrapper with rounded top and negative margin - matching reference */}
      <div className="rounded-t-sm -mt-2 relative z-10 bg-white flex-1 overflow-y-auto pb-32">
        {/* Label - FOODPRINT */}
        <div className="pt-3 pb-2 px-6">
          <span className="inline-block bg-yellow-400 px-4 py-1.5 text-sm font-bold uppercase">
            FOODPRINT
          </span>
        </div>

        {/* Title */}
        <h1 className="px-6 text-3xl font-bold text-gray-900 mb-5 leading-tight">
          {selectedFoodPrint.name ||
            "Roberto's Siopao: The Queen of All Siopaos in PH"}
        </h1>

        {/* Location with icon */}
        <div className="flex items-start px-6 mb-5">
          <MapPin className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <p className="text-gray-600 ml-2 text-base">
            {selectedFoodPrint.location ||
              'Rizal Street, La Paz Public Market, La Paz, Iloilo City'}
          </p>
        </div>

        {/* Description paragraphs */}
        <div className="px-6 space-y-5">
          <p className="text-gray-800 text-base leading-relaxed">
            {selectedFoodPrint.description ||
              "Roberto's Siopao is an iconic delicacy from Iloilo City, known for its generous size, flavorful fillings, and unique, homemade taste."}
          </p>
          {selectedFoodPrint.extendedDescription?.map((paragraph, idx) => (
            <p key={idx} className="text-gray-800 text-base leading-relaxed">
              {paragraph}
            </p>
          ))}
          {!selectedFoodPrint.extendedDescription && (
            <>
              <p className="text-gray-800 text-base leading-relaxed">
                A must-visit spot for both locals and tourists, Roberto&apos;s
                has built a strong reputation over the decades for serving
                siopao that&apos;s packed with a rich combination of ingredients
                — from savory pork and chicken to Chinese sausage and
                hard-boiled egg.
              </p>
              <p className="text-gray-800 text-base leading-relaxed">
                Their famous &quot;Queen Siopao&quot; stands out as the ultimate
                indulgence, stuffed with a hefty portion of meat, sausage, and
                egg, making it a satisfying meal on its own that&apos;s well
                worth the experience.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Action buttons with fade-out effect - fixed at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-20 pb-0 p-5 z-10">
        <LocationActionButtons />
      </div>
    </div>
  );
};

export default FoodPrintDetailsPanel;
