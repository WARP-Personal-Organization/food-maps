"use client";
import React from "react";
import Image from "next/image";
import { Location } from "@/types/types";
import CloseButton from "@/components/buttons/CloseButton";

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
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
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
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
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
              onClick={onViewDetails}
              className="w-full bg-[#F9D408] font-bold rounded-sm bg-[#ebebeb] flex items-center justify-center focus:outline-none 
                cursor-pointer hover:bg-[#E6C207] transition-colors py-2"
            >
              <span className="mr-2">View Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSummaryPanel;
