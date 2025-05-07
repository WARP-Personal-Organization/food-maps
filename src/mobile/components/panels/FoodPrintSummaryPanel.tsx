"use client";
import React from "react";
import Image from "next/image";
import { FoodPrint } from "@/types/types";
import CloseButton from "@/components/buttons/CloseButton";
import ReadArticleButton from "@/components/buttons/ReadArticleButton";
import GetDirectionsButton from "@/components/buttons/GetDirectionsButton";
import { MapPin } from "lucide-react";

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
      className={`fixed bottom-0  w-full h-[65vh] bg-white z-50 rounded-t-sm shadow-lg overflow-y-auto touch-pan-y
    transform transition-transform duration-300 ${
      isVisible ? "translate-y-0" : "translate-y-full"
    }`}
    >
      {/* Close button (X) at top right */}
      <div className="absolute top-4 right-4 z-50">
        <CloseButton onClick={onClose}/>
      </div>

      {/* Main image - Adjusted height */}
      <div className="relative w-full" style={{ height: "80vw" }}>
        <Image
          src={imageUrl || "/images/robertos/r1.webp"}
          alt={`${selectedFoodPrint.name} Image`}
          layout="fill"
          objectFit="cover"
          className="z-10 object-cover"
        />
      </div>

      {/* Content wrapper with rounded top and negative margin - matching reference */}
      {/* Removed pb-2 from this div */}
      <div className="rounded-t-lg bg-white flex flex-col w-full p-6 pt-4 gap-4 overflow-y-auto flex-1 z-10 relative -mt-[10%]">
        {/* Label - FOODPRINT */}
        <div className="pt-3 pb-2 px-6">
          <span className="inline-block bg-yellow-300 rounded-sm px-4 py-1.5 text-sm font-bold uppercase">
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
              "Rizal Street, La Paz Public Market, La Paz, Iloilo City"}
          </p>
        </div>

        <div className="px-6">
          <div className="grid grid-cols-2 gap-2">
            <GetDirectionsButton className="bg-gray-200"/>

            <ReadArticleButton
              onClick={onReadArticle}
            />
          </div>
        </div>
         {/* Added pb-6 to the buttons container to add padding above the bottom */}
        <div className="pb-0"></div>
      </div>
    </div>
  );
};

export default FoodPrintSummaryPanel;