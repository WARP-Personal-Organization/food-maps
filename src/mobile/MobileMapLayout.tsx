"use client";

import React, { useRef, useMemo } from "react";
import PanelManager, { PanelManagerRef } from "./components/PanelManager";
import { Location, FoodPrint, Dish } from "@/types/types";
import {
  ClientOnly,
  MapComponent,
  EmptyState,
} from "../components/map/MapUtilComponents";

import { IoClose, IoReturnUpBackSharp } from "react-icons/io5";
import MenuButton from "@/components/buttons/MenuButton";
import FilterButton from "@/components/buttons/FilterButton";
import { FoodPrintData } from "@/lib/FoodPrintData";

interface MobileMapLayoutProps {
  dishData: Dish[];
  foodPrintData: FoodPrintData;
  locationsMap: {
    [key: string]: Location[];
  };
  activeFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
}

const MobileMapLayout: React.FC<MobileMapLayoutProps> = ({
  dishData,
  foodPrintData,
  locationsMap,
  activeFilters = [],
  onFilterChange,
}) => {
  const panelRef = useRef<PanelManagerRef | null>(null);

  // Filter dishes based on active filters
  const filteredDishes =
    activeFilters.length === 0
      ? dishData
      : dishData.filter((dish) => activeFilters.includes(dish.name));

  // Helper to determine if we have dishes to display
  const hasDishes = filteredDishes && filteredDishes.length > 0;

  // Helper to get locations based on active filters
  const getFilteredLocations = () => {
    // Collect all locations for the active filters
    const allLocations: Location[] = [];
    activeFilters.forEach((filter) => {
      if (locationsMap[filter]) {
        allLocations.push(...locationsMap[filter]);
      }
    });

    // Remove duplicates (if a location appears for multiple filters)
    return allLocations.filter(
      (location, index, self) =>
        index === self.findIndex((l) => l.name === location.name)
    );
  };
  const filteredLocations = getFilteredLocations();
  // Update filters
  const updateFilters = (filters: string[]) => {
    onFilterChange?.(filters);
  };

  // Foodprint markers filtered by active filters
  const foodprintMarkers = activeFilters.length
    ? foodPrintData.markers.filter((marker) =>
      activeFilters.includes(marker.dishName)
    )
    : foodPrintData.markers;

  // Get all locations
  const allLocations = useMemo(() => {
    const allLocs: Location[] = [];
    if (activeFilters.length > 0) {
      // Only include locations for active filters
      activeFilters.forEach((filter) => {
        if (locationsMap[filter]) {
          allLocs.push(...locationsMap[filter]);
        }
      });
    } else {
      // Include all locations when no filters are active
      Object.values(locationsMap).forEach((locations) => {
        allLocs.push(...locations);
      });
    }
    return allLocs;
  }, [locationsMap, activeFilters]);
  // Location click handler
  const handleLocationClick = (location: Location) => {
    if (window.innerWidth <= 899) {
      panelRef.current?.openLocationSummary(location);
    }
  };

  // Foodprint click handler
  const handleFoodprintClick = (foodprint: FoodPrint) => {
    if (window.innerWidth <= 899) {
      panelRef.current?.openFoodPrintSummary(foodprint);
    }
  };

  return (
    <div className="hidden max-[899px]:flex flex-col h-screen">
      <PanelManager
        ref={panelRef}
        dishData={dishData}
        selectedDishes={activeFilters}
        onFilterApply={updateFilters}
      />

      {/* Filter Button */}
      <FilterButton className="z-20 absolute" onClick={() => panelRef.current?.openFilter()} />

      {/* Menu Button */}
      <MenuButton onClick={() => panelRef.current?.openMenu()} />

      {/* Map or Empty State */}
      {hasDishes ? (
        <ClientOnly>
          <div className="h-full w-full bg-[#3b3b3f]">
            <MapComponent
              key={`mobile-map-${activeFilters.join("-")}-${allLocations.length
                }`}
              locations={filteredLocations}
              foodPrintMarkers={foodprintMarkers}
              mapImageUrl="/images/map/Map.png"
              mapBounds={[
                [0, 0],
                [1000, 1000],
              ]}
              defaultZoom={3}
              onLocationClick={handleLocationClick}
              onFoodPrintClick={handleFoodprintClick}
              useCustomMap
            />
          </div>
        </ClientOnly>
      ) : (
        <EmptyState />
      )}

      {/* Active Filters + Back Button UI */}
      {activeFilters.length > 0 && (
        <div className="absolute bottom-0 left-0 w-full max-h-[35vh] z-10 flex flex-col justify-start gap-4 px-4 pt-6 pb-4 bg-gradient-to-t from-[#202020] to-transparent overflow-hidden">
          <div className="flex flex-col gap-2 overflow-y-auto pr-1">
            <span className="text-xs font-bold text-white">
              Filters ({activeFilters.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <div
                  key={filter}
                  className="bg-yellow-300 border border-blue-400 rounded-full flex items-center text-sm text-gray-900 font-medium px-2 py-2 shadow-sm"
                >
                  <span className="pl-2 pr-1">{filter}</span>
                  <button
                    onClick={() =>
                      updateFilters(activeFilters.filter((f) => f !== filter))
                    }
                    className="w-5 h-5 flex items-center justify-center text-gray-800"
                    aria-label={`Remove ${filter} filter`}
                  >
                    <IoClose />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full mt-2">
            <button
              onClick={() => panelRef.current?.openHome()}
              className="w-full bg-white py-3 px-4 rounded-lg shadow text-gray-800 font-semibold flex items-center justify-center"
            >
              <IoReturnUpBackSharp className="w-5 h-5 mr-2" />
              Back to Dishes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMapLayout;
