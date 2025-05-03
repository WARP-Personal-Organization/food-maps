"use client";

import React, { useRef } from "react";
import { Location } from "@/lib/locationData";
import {
  ClientOnly,
  MapComponent,
  EmptyState,
} from "../components/layout/MapUtilComponents";
import { foodPrintsData, FoodPrint } from "@/lib/foodprintData";
import { IoClose, IoReturnUpBackSharp } from "react-icons/io5";
import PanelManager, { PanelManagerRef } from "./components/PanelManager";
import { useRouter } from "next/navigation";
import FilterButton from "./components/buttons/FilterButton";
import MenuButton from "./components/buttons/MenuButton";
import Dishes from "@/lib/Dishes";

interface MobileMapLayoutProps {
  hasDishes: boolean;
  locations: Location[];
  onLocationClick: (location: Location) => void;
  activeFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
  onFoodprintClick?: (foodprint: FoodPrint) => void;
}

const MobileMapLayout: React.FC<MobileMapLayoutProps> = ({
  hasDishes,
  locations,
  onLocationClick,
  activeFilters = [],
  onFilterChange,
  onFoodprintClick,
}) => {
  const router = useRouter();
  const panelRef = useRef<PanelManagerRef | null>(null);

  const updateFilters = (filters: string[]) => {
    onFilterChange?.(filters);
  };

  const foodprintMarkers = activeFilters.length
    ? foodPrintsData.markers.filter((marker) =>
        activeFilters.includes(marker.dishName)
      )
    : foodPrintsData.markers;

  // Fetch dishes from the server
  // This function should be called in a useEffect or similar to fetch data on component mount
  {
    /* const fetchDishes = async () => {
      try {
        const res = await fetch("/api/dishes");
        if (!res.ok) throw new Error("Failed to fetch dishes");
        const data = await res.json();
        return data.dishes; 
      } catch (err) {
        console.error(err);
        return [];
      }
    };*/
  }

  return (
    <div className="absolute inset-0 w-full">
      <PanelManager
        ref={panelRef}
        dishes={Dishes}
        onFilterApply={updateFilters}
      />

      {/* Filter Button */}
      <FilterButton onClick={() => panelRef.current?.openFilter()} />

      {/* Menu Button */}
      <MenuButton onClick={() => panelRef.current?.openMenu()} />

      {/* Map or Empty State */}
      {hasDishes ? (
        <ClientOnly>
          <div className="h-full w-full bg-[#3b3b3f]">
            <MapComponent
              key={`mobile-map-${activeFilters.join("-")}-${locations.length}`}
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
              useCustomMap
            />
          </div>
        </ClientOnly>
      ) : (
        <EmptyState />
      )}

      {/* Active Filters + Back Button UI */}
      {activeFilters.length > 0 && (
        <div className="absolute bottom-0 left-0 w-full max-h-[35vh] z-20 flex flex-col justify-start gap-4 px-4 pt-6 pb-4 bg-gradient-to-t from-[#202020] to-transparent overflow-hidden">
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
              onClick={() => router.push("/")}
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
