'use client';

import React, { useState } from 'react';
import { Dish } from '@/lib/dishData';
import { Location } from '@/lib/locationData';
import FoodPrintsNavbar from '@/components/FoooPrintsNavbar';
import LeftSidePanel from './LeftSidePanel';
import RightSideMapPanel from './RightSideMapPanel';
import MobileMapPanel from './MobileMapPanel';

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
}

const FoodMapLayout: React.FC<FoodMapLayoutProps> = ({
  dishes,
  locationsMap,
  filterUI,
  activeFilters = [],
  onFilterChange,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setIsPanelCollapsed(false); // Expand panel when a location is clicked
  };

  const closeLocationDetail = () => {
    setSelectedLocation(null);
  };

  const togglePanelCollapse = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  // Combine all locations from all selected dishes
  const allLocations = Object.values(locationsMap).flat();

  // Check if we have any dishes to display
  const hasDishes = dishes.length > 0;

  return (
    <div className="h-screen w-full">
      {/* MOBILE VIEW */}
      <div className="lg:hidden flex flex-col h-screen">
        <section className="fixed top-0 z-50 w-full">
          <FoodPrintsNavbar />
        </section>

        <div className="h-full w-full pt-16 relative">
          {/* Panel layer - absolute positioned with higher z-index */}
          {!isPanelCollapsed && (
            <div className="absolute inset-0 z-30 pt-16">
              <LeftSidePanel
                selectedLocation={selectedLocation}
                closeLocationDetail={closeLocationDetail}
                activeFilters={activeFilters}
                onFilterChange={onFilterChange}
                locationsMap={locationsMap}
                isMobile={true}
                onToggleCollapse={togglePanelCollapse}
              />
            </div>
          )}

          {/* Map layer - always fills the container */}
          <MobileMapPanel
            filterUI={filterUI}
            hasDishes={hasDishes}
            locations={allLocations}
            onLocationClick={handleLocationClick}
          />
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden lg:flex h-screen w-full bg-white overflow-hidden">
        {/* Left Side - Text Content (30% Width) */}
        <div
          className={`${
            isPanelCollapsed ? 'w-0 opacity-0' : 'w-[30%] opacity-100'
          } h-full overflow-hidden transition-all duration-300 ease-in-out`}
        >
          {!isPanelCollapsed && (
            <div className="w-full h-full">
              <LeftSidePanel
                selectedLocation={selectedLocation}
                closeLocationDetail={closeLocationDetail}
                activeFilters={activeFilters}
                onFilterChange={onFilterChange}
                locationsMap={locationsMap}
                onToggleCollapse={togglePanelCollapse}
              />
            </div>
          )}
        </div>

        {/* Right Side - Map (expanding to 100% when panel is collapsed) */}
        <RightSideMapPanel
          isPanelCollapsed={isPanelCollapsed}
          filterUI={filterUI}
          hasDishes={hasDishes}
          locations={allLocations}
          onLocationClick={handleLocationClick}
        />
      </div>
    </div>
  );
};

export default FoodMapLayout;
