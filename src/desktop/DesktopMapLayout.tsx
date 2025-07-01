"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import PanelManager, { PanelManagerRef } from "./components/PanelManager";
import { Location, FoodPrint, Dish, PanelType } from "@/types/types";
import {
  ClientOnly,
  MapComponent,
  EmptyState,
} from "../components/map/MapUtilComponents";

import { IoClose } from "react-icons/io5";
import MenuButton from "@/components/buttons/MenuButton";
import FilterButton from "@/components/buttons/FilterButton";
import HomeButton from "@/components/buttons/HomeButton";
import { FoodPrintData } from "@/lib/FoodPrintData";
import { denormalizeKey } from "@/lib/utils";

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
  const [panelOpen, setPanelOpen] = useState(true);
  const [currentPanel, setCurrentPanel] = useState<PanelType | null>(null);
  useEffect(() => {
    if (currentPanel === null && panelRef.current) {
      panelRef.current.openDishDetails(); // or openHome(), depending on which one your HomeButton triggers
      setPanelOpen(true);
    }
  }, [currentPanel]);
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
    setPanelOpen(true);
  };

  const handleFoodprintClick = (foodprint: FoodPrint) => {
    panelRef.current?.openFoodPrintDetail(foodprint);
    setPanelOpen(true);
  };

  const handleRemoveFilter = (filterToRemove: string) => {
    handleFilterChange((prev) => prev.filter((f) => f !== filterToRemove));
  };

  return (
    <div className="hidden min-[900px]:flex h-screen w-full bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full gap-4 overflow-hidden">
        <PanelManager
          ref={panelRef}
          dishData={dishData}
          selectedDishes={activeFilters}
          onFilterApply={handleFilterChange}
          onClose={() => setPanelOpen(false)}
          onPanelChange={setCurrentPanel}
        />
      </div>

      {(!currentPanel || !["explore", "filter"].includes(currentPanel)) && (
        <div
          className={`absolute z-30 w-full transition-transform duration-300 ease-in-out ${
            panelOpen
              ? "translate-x-[300px] md:translate-x-[320px] lg:translate-x-[350px] xl:translate-x-[400px]"
              : "translate-x-0"
          }`}
        >
          <div className="flex items-center gap-4 px-4 py-3 overflow-x-auto pt-10">
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

            <div className="flex items-center gap-2 flex-wrap text-white">
              <span className="text-xs font-bold whitespace-nowrap">
                Filters ({activeFilters.length})
              </span>

              {activeFilters.map((filter) => (
                <div
                  key={filter}
                  className="bg-yellow-300 border border-blue-400 rounded-full flex items-center text-sm text-gray-900 font-medium px-3 py-1 shadow-sm"
                >
                  <span className="pr-1">{denormalizeKey(filter)}</span>
                  <button
                    onClick={() => handleRemoveFilter(filter)}
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

      <MenuButton
        className="z-30"
        onClick={() => panelRef.current?.openMenu()}
      />

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
