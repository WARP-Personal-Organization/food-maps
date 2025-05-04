"use client";
import React from "react";
import Image from "next/image";
import { FoodPrint } from "@/types/types";
import CloseButton from "../buttons/CloseButton";
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

      {/* Close button (X) at top right */}
      <div className="absolute top-4 right-4 z-50">
        <CloseButton onClick={onClose} />
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
              "Rizal Street, La Paz Public Market, La Paz, Iloilo City"}
          </p>
        </div>

        <div className="flex flex-col gap-10 px-6 py-6">
          <div className="grid grid-cols-2 gap-2">
            <button
              className="w-full bg-[#F9D408] font-bold rounded-sm text-[#3b3b3b] text-base text-center inline-block 
            cursor-pointer hover:bg-[#E6C207] transition-colors shadow-sm py-2 flex items-center justify-center"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="mr-2 w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.43 10.59l-9.01-9.01c-.75-.75-2.07-.76-2.83 0l-9 9c-.78.78-.78 2.04 0 2.82l9 9c.39.39.9.58 1.41.58.51 0 1.02-.19 1.41-.58l8.99-8.99c.79-.76.8-2.02.03-2.82zm-10.42 10.4l-9-9 9-9 9 9-9 9z" />
                  <path d="M8 11v4h2v-3h4v2.5l3.5-3.5L14 7.5V10H9c-.55 0-1 .45-1 1z" />
                </svg>
                Get Directions
              </span>
            </button>

            <button
              onClick={onReadArticle}
              className="w-full bg-[#F9D408] font-bold rounded-sm bg-[#ebebeb] flex items-center justify-center focus:outline-none 
                cursor-pointer hover:bg-[#E6C207] transition-colors py-2"
            >
              <span className="mr-2">Read Article</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPrintSummaryPanel;
