'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import PanelManager, { PanelManagerRef } from './components/PanelManager';
import { Location, FoodPrint, Dish, PanelType } from '@/types/types';
import {
  ClientOnly,
  MapComponent,
  EmptyState,
} from '../components/map/MapUtilComponents';

import { IoClose } from 'react-icons/io5';
import MenuButton from '@/components/buttons/MenuButton';
import FilterButton from '@/components/buttons/FilterButton';
import HomeButton from '@/components/buttons/HomeButton';
import { FoodPrintData } from '@/lib/FoodPrintData';

interface DesktopMapLayoutProps {
  dishData: Dish[];
  foodPrintData: FoodPrintData;
  locationsMap: {
    [key: string]: Location[];
  };
  activeFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
}

const DesktopMapLayout: React.FC<DesktopMapLayoutProps> = ({
  dishData,
  foodPrintData,
  locationsMap,
  activeFilters = [],
  onFilterChange,
}) => {
  const panelRef = useRef<PanelManagerRef | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentPanel, setCurrentPanel] = useState<PanelType | null>(null);

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
    panelRef.current?.openLocationDetail(location);
    setPanelOpen(true);
  };

  // Foodprint click handler
  const handleFoodprintClick = (foodprint: FoodPrint) => {
    panelRef.current?.openFoodPrintDetail(foodprint);
    setPanelOpen(true);
  };

  // Update filters based on search params
  useEffect(() => {
    if (!window.location.search) return;

    const searchParams = new URLSearchParams(window.location.search);
    const dishParam = searchParams.get('dish');

    if (dishParam && onFilterChange) {
      const newFilters = dishParam.split(',');
      if (JSON.stringify(activeFilters) !== JSON.stringify(newFilters)) {
        onFilterChange(newFilters);
      }
    }
  }, [onFilterChange, activeFilters]);

  return (
    <div className="hidden min-[900px]:flex h-screen w-full bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full gap-4 overflow-hidden">
        <PanelManager
          ref={panelRef}
          dishData={dishData}
          selectedDishes={activeFilters}
          onFilterApply={updateFilters}
          onClose={() => setPanelOpen(false)}
          onPanelChange={setCurrentPanel}
        />
      </div>
      {(!currentPanel || !['explore', 'filter'].includes(currentPanel)) && (
        <div
          className={`absolute z-30 w-full transition-transform duration-300 ease-in-out ${
            panelOpen
              ? 'translate-x-[300px] md:translate-x-[320px] lg:translate-x-[350px] xl:translate-x-[400px]'
              : 'translate-x-0'
          }`}
        >
          <div className="flex items-center gap-4 px-4 py-3 overflow-x-auto pt-10">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <HomeButton
                className="z-10"
                onClick={() => {
                  panelRef.current?.openDishDetails();
                  setPanelOpen(true);
                }}
              />
              <FilterButton
                isDesktop={true}
                onClick={() => {
                  panelRef.current?.openFilter();
                  setPanelOpen(true);
                }}
              />
            </div>

            {/* Filter Label + Tags */}
            <div className="flex items-center gap-2 flex-wrap text-white">
              <span className="text-xs font-bold whitespace-nowrap">
                Filters ({activeFilters.length})
              </span>

              {activeFilters.map((filter) => (
                <div
                  key={filter}
                  className="bg-yellow-300 border border-blue-400 rounded-full flex items-center text-sm text-gray-900 font-medium px-3 py-1 shadow-sm"
                >
                  <span className="pr-1">{filter}</span>
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
        </div>
      )}

      {/* Menu Button */}
      <MenuButton
        className="z-30"
        onClick={() => panelRef.current?.openMenu()}
      />

      {/* Map or Empty State */}
      {hasDishes ? (
        <ClientOnly>
          <div className="h-full w-full bg-[#3b3b3f]">
            <MapComponent
              key={`mobile-map-${activeFilters.join('-')}-${
                allLocations.length
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
              isDesktop = {true}
            />
          </div>
        </ClientOnly>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default DesktopMapLayout;
