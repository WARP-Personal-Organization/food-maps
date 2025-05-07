"use client";
import React from "react";
import Image from "next/image";
import { Location } from "@/types/types";
import GetDirectionsButton from "@/components/buttons/GetDirectionsButton";
import CloseButton from "@/components/buttons/CloseButton";
import ViewDetailsButton from "@/components/buttons/ViewDetailsButton";
import { MapPin, Tag } from "lucide-react";

interface LocationSummaryPanelProps {
  location: Location | null;
  isVisible: boolean;
  onClose: () => void;
  onViewDetails: () => void;
}

const LocationSummaryPanel: React.FC<LocationSummaryPanelProps> = ({
  location,
  onClose,
  onViewDetails,
  isVisible,
}) => {
  if (!location) return null;

  const address = location.address;
  const openHours = location.openHours;
  const priceRange = location.priceRange;

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
          src={location.photos?.[0] || "/images/robertos/r5.jpg"}
          alt={`${location.name} Image`}
          layout="fill"
          objectFit="cover"
          className="z-10 object-cover"
        />
      </div>

      {/* Close button (X) at top right */}
      <div className="absolute top-4 right-4 z-50">
        <CloseButton onClick={onClose} />
      </div>

      <div className="bg-white flex flex-col rounded-t-sm w-full gap-2 pt-9 overflow-y-auto flex-1 z-10 relative -mt-[10%]">
        <div className="flex flex-col gap-4 px-6">
          {/* Title */}
          <h1 className="text-3xl font-serif font-bold text-gray-800 md:text-2xl xl:text-3xl 2xl:text-5xl 2xl:mb-6">
            {location.name}
          </h1>

          <div className="flex flex-col gap-2">
            {/* Info Rows */}
            {[
              {
                icon: (
                  <MapPin className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                ),
                text: address,
              },
              {
                icon: (
                  <>
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </>
                ),
                text: openHours,
              },
              {
                icon: (
                  <Tag className="h-5 w-5"/>
                ),
                text: priceRange,
              },
            ].map(({ icon, text }, index) => (
              <div
                key={index}
                className="flex items-start gap-3 2xl:gap-4 2xl:mb-4"
              >
                <div className="text-yellow-500 flex-shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 xl:w-5 xl:h-5 2xl:scale-125"
                  >
                    {icon}
                  </svg>
                </div>
                <p className="text-sm text-gray-500 leading-tight md:text-xs 2xl:text-lg">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-10 px-6 mt-4">
          <div className="grid grid-cols-2 gap-2">
            <GetDirectionsButton className="bg-yellow-300"/>

            <ViewDetailsButton
              onClick={onViewDetails}
              className="bg-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSummaryPanel;
