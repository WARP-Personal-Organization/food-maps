"use client";

import React from "react";
import { Location } from "@/lib/locationData";
import { ClientOnly, MapComponent, EmptyState } from "./MapUtilComponents";
import { foodPrintsData, FoodPrint } from "@/lib/foodprintData";
import { useRouter } from "next/navigation";
import { IoClose, IoReturnUpBackSharp } from "react-icons/io5";

interface MobileMapPanelProps {
  filterUI?: React.ReactNode;
  hasDishes: boolean;
  locations: Location[];
  onLocationClick: (location: Location) => void;
  showBackButton?: boolean;
  activeFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
  onFoodprintClick?: (foodprint: FoodPrint) => void;
}

const MobileMapPanel: React.FC<MobileMapPanelProps> = ({
  filterUI,
  hasDishes,
  locations,
  onLocationClick,
  showBackButton = false,
  activeFilters = [],
  onFilterChange,
  onFoodprintClick,
}) => {
  const router = useRouter();

  const handleBackToDishes = () => {
    router.push("/");
  };

  const removeFilter = (filterName: string) => {
    if (onFilterChange) {
      onFilterChange(activeFilters.filter((filter) => filter !== filterName));
    }
  };

  // Filter foodprint markers based on active filters
  const foodprintMarkers =
    activeFilters.length > 0
      ? foodPrintsData.markers.filter((marker) =>
          activeFilters.includes(marker.dishName)
        )
      : foodPrintsData.markers; // Show all markers when no filters are active

  console.log("Mobile - Active filters:", activeFilters);
  console.log(
    "Mobile - Foodprint markers to display:",
    foodprintMarkers.length
  );

  return (
    <div className="absolute inset-0 z-20 w-full">
      {/* Filter UI on mobile - top left of map */}
      {filterUI && (
        <div className="fixed top-20 left-4 z-[100] max-w-[85%] cursor-pointer">
          {filterUI}
        </div>
      )}

      {/* Back button (only shows when panel is collapsed) */}
      {/* {showBackButton && (
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-[100] bg-white/90 rounded-full p-2 shadow-md"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      )} */}

      {hasDishes ? (
        <ClientOnly>
          <div className="h-full w-full" style={{ backgroundColor: "#3b3b3f" }}>
            <MapComponent
              key={`mobile-map-${activeFilters.join("-")}-${
                locations.length
              }-${showBackButton}`}
              locations={locations}
              foodPrintMarkers={foodprintMarkers}
              mapImageUrl="/Map.png"
              mapBounds={[
                [0, 0],
                [1000, 1000],
              ]}
              defaultZoom={3}
              onLocationClick={onLocationClick}
              onFoodPrintClick={onFoodprintClick}
              useCustomMap={true}
            />
          </div>
        </ClientOnly>
      ) : (
        <EmptyState />
      )}

      {/* Active Filters UI */}
      {activeFilters.length > 0 && (
        <div className="absolute bottom-0 left-0 w-full h-[25vh] z-50 flex flex-col justify-start gap-[28px] pt-12 pb-8 px-6 bg-[linear-gradient(to_top,#202020_0%,transparent_100%)]">
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-xs font-bold text-white px-2 py-1 mb-2 gap-x-1.5 inline-flex items-center">
              Filters ({activeFilters.length})
            </span>
            <div className="flex flex-wrap gap-x-1.5 justify-start">
              {activeFilters.map((filter) => (
                <div
                  key={filter}
                  className="bg-yellow-300 rounded-full pl-0 pr-2 py-0 text-gray-900 font-medium flex items-center shadow-sm text-sm border-2 border-blue-400"
                >
                  <div className="w-1 h-9"></div>
                  <span className="ml-2 px-1 font-bold text-sm py-1">
                    {filter}
                  </span>
                  <button
                    onClick={() => removeFilter(filter)}
                    className="rounded-full w-4 h-4 flex items-center justify-start text-lg"
                    aria-label={`Remove ${filter} filter`}
                  >
                    <IoClose className="text-gray-800" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Back button at the bottom of the screen */}
          {showBackButton && (
            <div className="relative bottom-4 left-0 right-0 flex justify-center z-50 w-full gap-x-6 py-2">
              <button
                onClick={handleBackToDishes}
                className="w-full bg-white py-3 px-8 rounded-lg shadow-lg 
            text-gray-800 font-semibold flex items-center justify-center text-center"
              >
                <IoReturnUpBackSharp className="w-5 h-5 mr-2" />
                Back to Dishes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileMapPanel;
