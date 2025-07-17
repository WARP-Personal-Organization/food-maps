"use client";

import React, { useRef, useMemo } from "react";
import PanelManager, { PanelManagerRef } from "./components/PanelManager";
import { Location, FoodPrint, Dish } from "@/types/types";
import {
  ClientOnly,
  MapComponent,
  EmptyState,
} from "../components/map/MapUtilComponents";

import MenuButton from "@/components/buttons/MenuButton";
import FilterButton from "@/components/buttons/FilterButton";
// import HomeButton from "@/components/buttons/HomeButton";
import { FoodPrintData } from "@/lib/FoodPrintData";

interface DesktopMapLayoutProps {
  dishData: Dish[];
  foodPrintData: FoodPrintData;
  locationsMap: {
    [key: string]: Location[];
  };
  activeFilters: string[];
  onFilterChange: (filters: string[] | ((prev: string[]) => string[])) => void;
}
import { districts } from "@/lib/DistrictCoordinatesData";

const DesktopMapLayout: React.FC<DesktopMapLayoutProps> = ({
  dishData,
  foodPrintData,
  locationsMap,
  activeFilters,
  onFilterChange,
}) => {
  const panelRef = useRef<PanelManagerRef | null>(null);

  const handleFilterChange = (
    filters: string[] | ((prev: string[]) => string[])
  ) => {
    console.log("Filters applied from HomePanel:", filters);
    onFilterChange(filters);
  };

  const filteredDishes =
    activeFilters.length === 0
      ? dishData
      : dishData.filter((dish) => activeFilters.includes(dish.name));

  const hasDishes = filteredDishes.length > 0;

  const getFilteredLocations = () => {
    const allLocations: Location[] = [];
    activeFilters.forEach((filter) => {
      if (locationsMap[filter]) {
        allLocations.push(...locationsMap[filter]);
      }
    });
    return allLocations.filter(
      (location, index, self) =>
        index === self.findIndex((l) => l.name === location.name)
    );
  };

  const filteredLocations = getFilteredLocations();

  const foodprintMarkers = activeFilters.length
    ? foodPrintData.markers.filter((marker) =>
        activeFilters.includes(marker.dishType)
      )
    : foodPrintData.markers;

  const allLocations = useMemo(() => {
    const allLocs: Location[] = [];
    if (activeFilters.length > 0) {
      activeFilters.forEach((filter) => {
        if (locationsMap[filter]) {
          allLocs.push(...locationsMap[filter]);
        }
      });
    } else {
      Object.values(locationsMap).forEach((locations) => {
        allLocs.push(...locations);
      });
    }
    return allLocs;
  }, [locationsMap, activeFilters]);

  const handleLocationClick = (location: Location) => {
    panelRef.current?.openLocationDetail(location);
  };

  const handleFoodprintClick = (foodprint: FoodPrint) => {
    panelRef.current?.openFoodPrintDetail(foodprint);
  };

  return (
    <div className="hidden min-[900px]:flex h-screen w-full bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full gap-4 overflow-hidden">
        <PanelManager
          ref={panelRef}
          dishData={dishData}
          selectedDishes={activeFilters}
          onFilterApply={handleFilterChange}
          onClose={() => {}}
          onPanelChange={() => {}}
        />
      </div>
      {/* FAB container for Filter only (Home removed) */}
      <div className="fixed top-8 left-8 z-30 flex flex-col gap-4">
        <FilterButton
          isDesktop={true}
          onClick={() => {
            panelRef.current?.openFilter();
          }}
        />
      </div>
      {/* MenuButton remains top right */}
      <MenuButton
        className="fixed top-8 right-8 z-30"
        onClick={() => panelRef.current?.openMenu()}
      />
      {/* Map and rest of UI */}
      {hasDishes ? (
        <ClientOnly>
          <div className="h-full w-full bg-[#3b3b3f]">
            <MapComponent
              key={`desktop-map-${activeFilters.join("-")}-${
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
              isDesktop={true}
              districts={districts}
              onAboutClick={() => {
                panelRef.current?.openAbout();
              }}
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
