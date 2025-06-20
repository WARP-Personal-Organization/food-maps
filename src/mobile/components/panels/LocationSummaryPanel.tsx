"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Location } from "@/types/types";
import { MapPin, Tag } from "lucide-react";
import GetDirectionsButton from "@/components/buttons/GetDirectionsButton";
import CloseButton from "@/components/buttons/CloseButton";
// import ViewDetailsButton from "@/components/buttons/ViewDetailsButton";

interface LocationSummaryPanelProps {
  location: Location | null;
  isVisible: boolean;
  onClose: () => void;
  onViewDetails: () => void;
}

const LocationSummaryPanel: React.FC<LocationSummaryPanelProps> = ({
  location,
  onClose,
  // onViewDetails,
  isVisible,
}) => {
  const [activeTab, setActiveTab] = useState<"photos" | "menu">("photos");

  if (!location) return null;

  const address = location.address;
  const openHours = location.openHours;
  const priceRange = location.priceRange;

  const photosToShow =
    activeTab === "menu" ? location.menuPhotos : location.photos;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 w-full h-[80vh] bg-white z-50 rounded-t-sm shadow-lg overflow-y-auto touch-pan-y
        transform transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
    >
      {/* Close Button */}
      <div className="absolute top-4 right-4 z-50">
        <CloseButton onClick={onClose} />
      </div>

      {/* Image Header */}
      <div className="relative w-full flex-shrink-0" style={{ height: "80vw" }}>
        <Image
          src={location.photos?.[0]}
          alt={`${location.name} Image`}
          layout="fill"
          objectFit="cover"
          className="z-10 object-cover"
        />
      </div>

      {/* Info Section */}
      <div className="rounded-t-lg bg-white w-full p-6 pt-4 gap-4 z-10 relative -mt-[10%] flex flex-col">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-5 leading-tight">
          {location.name}
        </h1>

        <div className="flex flex-col gap-2">
          {[
            {
              icon: <MapPin className="h-5 w-5 text-yellow-500" />,
              text: address,
            },
            {
              icon: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              ),
              text: openHours,
            },
            {
              icon: <Tag className="h-5 w-5 text-yellow-500" />,
              text: priceRange,
            },
          ].map(({ icon, text }, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="text-yellow-500 flex-shrink-0">{icon}</div>
              <p className="text-sm text-gray-500 leading-tight">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mt-4">
        <div className="flex">
          {["photos", "menu"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 text-center py-3 text-base relative cursor-pointer ${
                activeTab === tab
                  ? "text-gray-800 font-bold"
                  : "text-gray-400 font-medium"
              }`}
              onClick={() => setActiveTab(tab as "photos" | "menu")}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Photos/Menu Grid */}
      <div className="p-4 grid grid-cols-3 gap-2 overflow-y-auto">
        {(photosToShow || []).slice(0, 5).map((photo, index) => (
          <div
            key={index}
            className={`relative rounded overflow-hidden bg-gray-200 ${
              index === 0 ? "col-span-1 row-span-2" : ""
            }`}
          >
            <div className="aspect-square h-full">
              <Image
                src={photo}
                alt={`${location.name} ${activeTab} ${index + 1}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="sticky bottom-0 z-10 bg-gradient-to-t from-white via-white to-transparent px-6 pt-4 pb-6">
        <div className="grid gap-3">
          <GetDirectionsButton
            className="bg-yellow-300"
            onClick={() => window.open(location.mapLink, "_blank")}
          />
          {/* <ViewDetailsButton onClick={onViewDetails} className="bg-gray-200" /> */}
        </div>
      </div>
    </div>
  );
};

export default LocationSummaryPanel;
