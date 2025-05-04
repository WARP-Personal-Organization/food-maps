'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Dish } from '@/lib/dishData';
import { Location } from '@/lib/locationData';
import LeftSidePanel from './LeftSidePanel';
import RightSideMapPanel from './RightSideMapPanel';
import { FoodPrint } from '@/lib/foodPrintsData';

interface FoodMapLayoutProps {
  dishes: Dish[];
  // For each dish, we need locations for the map
  locationsMap: {
    [key: string]: Location[]; // key is dish name, value is array of locations
  };
  // Filter UI element to be displayed on the map
  filterUI?: React.ReactNode;
  // Active filter for showing single dish detail panel
  activeFilters?: string[];
  // Optional callback for filter changes, used in the AllDishesView
  onFilterChange?: (filters: string[]) => void;
  // State to track if the filter dishes view is open
  isFilterDishesViewOpen?: boolean;
  // Function to toggle the filter dishes view
  toggleFilterDishesView?: () => void;
  // Whether the panel should be initially collapsed (map-only view)
  initialPanelCollapsed?: boolean;
}

const FoodMapLayout: React.FC<FoodMapLayoutProps> = ({
  dishes,
  locationsMap,
  filterUI,
  activeFilters = [],
  onFilterChange,
  isFilterDishesViewOpen = false,
  toggleFilterDishesView,
  initialPanelCollapsed = false,
}) => {
  // State for selected location detail and panel collapse
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(
    initialPanelCollapsed
  );
  const [selectedFoodprint, setSelectedFoodprint] = useState<FoodPrint | null>(
    null
  );

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

  // Helper to determine if we have dishes to display
  const hasDishes = dishes && dishes.length > 0;

  // Handler for when a location is clicked
  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setSelectedFoodprint(null); // Clear any selected foodprint
    setIsPanelCollapsed(false); // Ensure panel is expanded
  };

  // Handler for when a foodprint marker is clicked
  const handleFoodprintClick = (foodprint: FoodPrint) => {
    setSelectedFoodprint(foodprint);
    setSelectedLocation(null); // Clear any selected location
    setIsPanelCollapsed(false); // Ensure panel is expanded
  };

  // Handler for closing location detail panel
  const closeLocationDetail = () => {
    setSelectedLocation(null);

    // Clear filters if provided and collapse panel
    if (onFilterChange && activeFilters.length > 0) {
      onFilterChange([]);
    } else if (activeFilters.length === 0) {
      // If no filters are active, collapse the panel
      setIsPanelCollapsed(true);
    }
  };

  // Handler for closing foodprint detail panel
  const closeFoodprintDetail = () => {
    setSelectedFoodprint(null);
  };

  // Toggle the panel collapse state
  const togglePanelCollapse = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  // Check for URL parameters when component mounts
  useEffect(() => {
    if (!window.location.search) return;

    const searchParams = new URLSearchParams(window.location.search);
    const dishParam = searchParams.get('dish');
    const viewParam = searchParams.get('view');

    // If dish parameter exists, set it as the only active filter (if callback exists)
    if (dishParam && onFilterChange) {
      const newFilters = dishParam.split(',');
      // Only update if filters are different from current activeFilters
      if (JSON.stringify(activeFilters) !== JSON.stringify(newFilters)) {
        onFilterChange(newFilters);
      }
    }

    // If view=map parameter is passed, make sure panel is collapsed (map-only view)
    if (viewParam === 'map') {
      setIsPanelCollapsed(true);
    }
  }, [onFilterChange, activeFilters]);

  return (
    <div className="h-screen w-full">
      {/* DESKTOP VIEW - now visible from 900px and up */}
      <div className="hidden min-[900px]:flex h-screen w-full bg-white overflow-hidden">
        {/* Left Side - Text Content (responsive width based on screen size) */}
        <div
          className={`${
            isPanelCollapsed && !isFilterDishesViewOpen
              ? 'w-0 opacity-0'
              : 'min-[900px]:w-[260px] lg:w-[300px] xl:w-[360px] 2xl:w-[450px] 3xl:w-[520px] opacity-100'
          } h-full overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0 border-r border-gray-200`}
        >
          {(isFilterDishesViewOpen || !isPanelCollapsed) && (
            <div className="w-full h-full">
              <LeftSidePanel
                selectedLocation={selectedLocation}
                closeLocationDetail={closeLocationDetail}
                activeFilters={activeFilters}
                onFilterChange={onFilterChange}
                locationsMap={locationsMap}
                onToggleCollapse={togglePanelCollapse}
                isFilterDishesViewOpen={isFilterDishesViewOpen}
                toggleFilterDishesView={toggleFilterDishesView}
                selectedFoodprint={selectedFoodprint}
                onCloseFoodprint={closeFoodprintDetail}
              />
            </div>
          )}
        </div>

        {/* Right Side - Map (fills remaining space) */}
        <div className="flex-grow h-full">
          <RightSideMapPanel
            isPanelCollapsed={isPanelCollapsed && !isFilterDishesViewOpen}
            filterUI={filterUI}
            hasDishes={hasDishes}
            locations={allLocations}
            onLocationClick={handleLocationClick}
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
            onFoodprintClick={handleFoodprintClick}
          />
        </div>
      </div>
    </div>
  );
};

export default FoodMapLayout;
