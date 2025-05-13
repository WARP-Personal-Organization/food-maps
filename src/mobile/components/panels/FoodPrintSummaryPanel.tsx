'use client';
import React from 'react';
import Image from 'next/image';
import { FoodPrint } from '@/types/types';
import CloseButton from '@/components/buttons/CloseButton';
import ReadArticleButton from '@/components/buttons/ReadArticleButton';
import GetDirectionsButton from '@/components/buttons/GetDirectionsButton';
import { MapPin } from 'lucide-react';

interface FoodPrintSummaryPanelProps {
  selectedFoodPrint: FoodPrint | null;
  isVisible: boolean;
  onClose: () => void;
  onReadArticle: () => void;
}

const FoodPrintSummaryPanel: React.FC<FoodPrintSummaryPanelProps> = ({
  selectedFoodPrint,
  onClose,
  onReadArticle,
  isVisible,
}) => {
  if (!selectedFoodPrint) return null;

  const imageUrl = selectedFoodPrint.heroImage;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 w-full h-[65vh] bg-white z-50 rounded-t-sm shadow-lg overflow-y-auto touch-pan-y
    transform transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}
    >
      {/* Close button (X) at top right - Fixed position relative to the scrollable container */}
      <div className="absolute top-4 right-4 z-50">
        <div className="sticky top-0"><CloseButton onClick={onClose} /></div>
      </div>

      {/* Main image - Adjusted height. This scrolls with the content. */}
      {/* The image needs to be part of the scrollable flow */}
      <div className="relative w-full flex-shrink-0" style={{ height: '80vw' }}>
        <Image
          src={imageUrl || '/images/robertos/r1.webp'}
          alt={`${selectedFoodPrint.name} Image`}
          layout="fill"
          objectFit="cover"
          className="z-10 object-cover"
        />
      </div>

      {/* Content wrapper with rounded top and negative margin - matching reference */}
      {/* Removed flex, overflow-y-auto, flex-1 from this div */}
      <div className="rounded-t-lg bg-white w-full p-6 pt-4 gap-4 z-10 relative -mt-[10%] flex flex-col"> {/* Added flex flex-col here to manage internal layout, removed flex-1 and overflow */}
        {/* Label - FOODPRINT */}
        <div className="pt-3 pb-2 px-0"> {/* Adjusted padding for consistency */}
          <span className="inline-block bg-yellow-300 rounded-sm px-4 py-1.5 text-sm font-bold uppercase">
            FOODPRINT
          </span>
        </div>

        {/* Title */}
        <h1 className="px-0 text-3xl font-bold text-gray-900 mb-5 leading-tight"> {/* Adjusted padding for consistency */}
          {selectedFoodPrint.name ||
            "Roberto's Siopao: The Queen of All Siopaos in PH"}
        </h1>

        {/* Location with icon */}
        <div className="flex items-start px-0 mb-5"> {/* Adjusted padding for consistency */}
          <MapPin className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <p className="text-gray-600 ml-2 text-base">
            {selectedFoodPrint.location ||
              'Rizal Street, La Paz Public Market, La Paz, Iloilo City'}
          </p>
        </div>

        {/* Buttons Container */}
        <div className="sticky bottom-0 px-0 pb-6 bg-gradient-to-t from-white via-white to-transparent"> {/* Adjusted padding for consistency and added pb-6 */}
          <div className="grid grid-cols-2 gap-2">
            <GetDirectionsButton className="bg-gray-200" />

            <ReadArticleButton onClick={onReadArticle} />
          </div>
        </div>

        {/* Added placeholder for padding if needed, but pb-6 on the buttons container might be sufficient */}
        {/* <div className="pb-6"></div> */}
      </div>
    </div>
  );
};

export default FoodPrintSummaryPanel;