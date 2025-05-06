"use client";

import React, { useState, useEffect, useRef } from "react";
import { Location } from "@/lib/locationData";
import LocationDetailPanel from "@/components/LocationDetailPanel";
import FilteredDishPanel from "@/components/food-map/FilteredDishPanel";
import FilterDishesView from "@/components/food-map/FilterDishesView";
import { ilonggoDishes } from "@/lib/dishData";
import LocationCard from "@/desktop/components/panels/DishDetails/LocationCard";
import FoodPrintDetailsPanel from "@/components/FoodprintDetailsPanel";
import { FoodPrint } from "@/lib/foodprintData";

// Add a new ExplorePanel component to display the Explore UI
const ExplorePanel = ({
  activeFilters,
  onFilterChange,
  locationsMap,
  onClose,
}: {
  activeFilters: string[];
  onFilterChange?: (filters: string[]) => void;
  locationsMap: {
    [key: string]: Location[];
  };
  onClose?: () => void;
}) => {
  // Function to remove a filter
  const removeFilter = (filterName: string) => {
    if (onFilterChange) {
      onFilterChange(activeFilters.filter((filter) => filter !== filterName));
    }
  };

  // Get all matched locations
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

  // Get the filtered locations
  const filteredLocations = getFilteredLocations();

  // Handle close button click
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Explore Header */}
      <div className="flex justify-between items-center lg:px-4 xl:px-5 2xl:px-6 py-4">
        <h2 className="text-3xl lg:text-3xl xl:text-4xl font-bold font-serif">
          Explore
        </h2>
        <button
          onClick={handleClose}
          className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 w-10 h-10 flex items-center justify-center text-xl cursor-pointer"
          aria-label="Close explore panel"
        >
          ×
        </button>
      </div>

      {/* Active Filters Section */}
      <div className="lg:px-4 xl:px-5 2xl:px-6 pt-4 pb-0">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-base">Active Filters</h3>
          <span className="text-gray-500">(3)</span>
        </div>
        <div className="border-t border-gray-200 mb-4"></div>
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((filter) => (
            <div
              key={filter}
              className="bg-[#FFD800] rounded-full px-4 py-1.5 text-gray-900 font-medium flex items-center gap-1 text-sm"
            >
              <span>{filter}</span>
              <button
                onClick={() => removeFilter(filter)}
                className="ml-1 cursor-pointer"
                aria-label={`Remove ${filter} filter`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="lg:px-4 xl:px-5 2xl:px-6 pt-4 pb-2">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-base">Results</h3>
          <span className="text-gray-500">({filteredLocations.length})</span>
        </div>
        <div className="border-t border-gray-200 mb-3"></div>
      </div>

      {/* Results List - Dynamically generated from the filtered locations */}
      <div className="flex-1 overflow-y-auto lg:px-2 xl:px-3 2xl:px-4 pt-0 pb-2">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((location, index) => (
            <LocationCard
              key={`${location.name}-${index}`}
              name={location.name}
              image={location.iconUrl || "/images/filter-dish/siopao.png"}
              location={
                location.address
                  ? location.address.split(",")[0]
                  : "Iloilo City Proper"
              }
              duration="8 min"
              rating={4.2}
              tags={activeFilters.filter((filter) =>
                locationsMap[filter]?.some((loc) => loc.name === location.name)
              )}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No locations found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

interface LeftSidePanelProps {
  selectedLocation: Location | null;
  closeLocationDetail: () => void;
  activeFilters: string[];
  onFilterChange?: (filters: string[]) => void;
  locationsMap: {
    [key: string]: Location[];
  };
  isMobile?: boolean;
  onToggleCollapse?: () => void;
  isFilterDishesViewOpen?: boolean;
  toggleFilterDishesView?: () => void;
  selectedFoodprint?: FoodPrint | null;
  onCloseFoodprint?: () => void;
}

const LeftSidePanel: React.FC<LeftSidePanelProps> = ({
  selectedLocation,
  closeLocationDetail,
  activeFilters,
  onFilterChange,
  locationsMap,
  isMobile = false,
  onToggleCollapse,
  isFilterDishesViewOpen = false,
  toggleFilterDishesView,
  selectedFoodprint = null,
  onCloseFoodprint,
}) => {
  // Check if we have a single active filter (single dish selected)
  const singleFilterMode = activeFilters.length === 1;
  const activeDishFilter = singleFilterMode ? activeFilters[0] : null;
  const [shouldPreventCollapse, setShouldPreventCollapse] = useState(false);
  const hasMultipleFilters = activeFilters.length > 1;

  // Ref to prevent infinite loops when collapsing
  const hasTriggeredCollapseRef = useRef(false);

  // Listen for closeFilterViewOnly event
  useEffect(() => {
    const handleCloseFilterViewOnly = () => {
      setShouldPreventCollapse(true);

      // Reset after a short delay
      setTimeout(() => {
        setShouldPreventCollapse(false);
      }, 500);
    };

    document.addEventListener("closeFilterViewOnly", handleCloseFilterViewOnly);

    return () => {
      document.removeEventListener(
        "closeFilterViewOnly",
        handleCloseFilterViewOnly
      );
    };
  }, []);

  // Effect to auto-collapse panel when no content is available
  useEffect(() => {
    // Reset the ref when dependencies change
    hasTriggeredCollapseRef.current = false;

    // If there's no location, no filter dishes view, no filters, and no foodprint, collapse the panel
    if (
      !selectedLocation &&
      !isFilterDishesViewOpen &&
      activeFilters.length === 0 &&
      !selectedFoodprint &&
      onToggleCollapse &&
      !hasTriggeredCollapseRef.current &&
      !shouldPreventCollapse
    ) {
      // Set ref to prevent future collapses during this render cycle
      hasTriggeredCollapseRef.current = true;

      // Use a timeout to avoid immediate collapse which may cause issues
      setTimeout(() => {
        onToggleCollapse();
      }, 0);
    }
  }, [
    selectedLocation,
    isFilterDishesViewOpen,
    activeFilters.length,
    selectedFoodprint,
    onToggleCollapse,
    shouldPreventCollapse,
  ]);

  // Handler for when "X" is clicked to close the panel
  const handleClosePanel = () => {
    if (onToggleCollapse && !shouldPreventCollapse) {
      console.log("Collapsing panel from handleClosePanel");
      // Call immediately without timeout since this is directly triggered by user action
      onToggleCollapse();
    }
  };

  // Handler for closing the filter dishes view
  const handleCloseFilterDishesView = () => {
    console.log("handleCloseFilterDishesView triggered");
    // Toggle the filter view state
    if (toggleFilterDishesView) {
      console.log("Calling toggleFilterDishesView");
      toggleFilterDishesView();
    }

    // Collapse the panel if there's no filters active
    if (onToggleCollapse && activeFilters.length === 0) {
      console.log("Calling onToggleCollapse");
      onToggleCollapse();
    }
  };

  // Special case for FilterDishesView on mobile
  if (isMobile && isFilterDishesViewOpen) {
    return (
      <FilterDishesView
        activeFilters={activeFilters}
        onFilterChange={onFilterChange}
        locationsMap={locationsMap}
        onClose={handleCloseFilterDishesView}
        isMobile={true}
      />
    );
  }

  // Return FilterDishesView if it should be open, regardless of panel collapse state
  if (isFilterDishesViewOpen) {
    return (
      <div className="w-full h-full overflow-hidden flex flex-col">
        <FilterDishesView
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          locationsMap={locationsMap}
          onClose={handleCloseFilterDishesView}
          isMobile={isMobile}
        />
      </div>
    );
  }

  // If there's nothing to display, return null to allow the panel to collapse
  if (!selectedLocation && activeFilters.length === 0 && !selectedFoodprint) {
    return null;
  }

  // Desktop rendering
  return (
    <div className="w-full h-full overflow-hidden flex flex-col">
      {selectedFoodprint && onCloseFoodprint ? (
        <FoodPrintDetailsPanel
          selectedFoodPrint={selectedFoodprint}
          onClose={onCloseFoodprint}
        />
      ) : selectedLocation ? (
        <LocationDetailPanel
          location={selectedLocation}
          onClose={closeLocationDetail}
        />
      ) : singleFilterMode ? (
        <FilteredDishPanel
          dishes={ilonggoDishes}
          activeFilter={activeDishFilter}
          onClose={handleClosePanel}
        />
      ) : hasMultipleFilters ? (
        <ExplorePanel
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          locationsMap={locationsMap}
          onClose={handleClosePanel}
        />
      ) : null}
    </div>
  );
};

export default LeftSidePanel;
