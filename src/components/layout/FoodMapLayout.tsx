'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(
    initialPanelCollapsed
  );
  const [preventPanelCollapse, setPreventPanelCollapse] = useState(false);

  // Set panel collapsed state when initialPanelCollapsed changes
  useEffect(() => {
    setIsPanelCollapsed(initialPanelCollapsed);
  }, [initialPanelCollapsed]);

  // Add event listener for custom events
  useEffect(() => {
    const handleCloseFilterViewOnly = () => {
      setPreventPanelCollapse(true);

      // Reset the flag after a short delay
      setTimeout(() => {
        setPreventPanelCollapse(false);
      }, 500);
    };

    const handlePreventPanelCollapse = (event: Event) => {
      // Set the flag to prevent panel collapse
      setPreventPanelCollapse(true);

      // We can check if we're opening or closing the filter view using type assertion
      const customEvent = event as CustomEvent<{ isOpeningFilter: boolean }>;
      const isOpeningFilter = customEvent.detail?.isOpeningFilter;
      console.log(
        'Preventing panel collapse, opening filter:',
        isOpeningFilter
      );

      // Reset the flag after a short delay
      setTimeout(() => {
        setPreventPanelCollapse(false);
      }, 500);
    };

    // Handle the closeLocationDetail custom event
    const handleCloseLocationDetail = () => {
      console.log('Closing location detail from custom event');
      setSelectedLocation(null);
    };

    document.addEventListener('closeLocationDetail', handleCloseLocationDetail);
    document.addEventListener('closeFilterViewOnly', handleCloseFilterViewOnly);
    document.addEventListener(
      'preventPanelCollapse',
      handlePreventPanelCollapse
    );

    return () => {
      document.removeEventListener(
        'closeLocationDetail',
        handleCloseLocationDetail
      );
      document.removeEventListener(
        'closeFilterViewOnly',
        handleCloseFilterViewOnly
      );
      document.removeEventListener(
        'preventPanelCollapse',
        handlePreventPanelCollapse
      );
    };
  }, []);

  // Add effect to ensure panel is expanded when filter view is opened
  useEffect(() => {
    // When filter dishes view is opened, make sure the panel is expanded
    if (isFilterDishesViewOpen && isPanelCollapsed) {
      setIsPanelCollapsed(false);
    }
  }, [isFilterDishesViewOpen, isPanelCollapsed]);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setIsPanelCollapsed(false); // Expand panel when a location is clicked
    if (toggleFilterDishesView && isFilterDishesViewOpen) {
      handleFilterViewChange();
    }
  };

  const closeLocationDetail = () => {
    setSelectedLocation(null);
  };

  const togglePanelCollapse = () => {
    // Only collapse the panel if preventPanelCollapse is false
    if (!preventPanelCollapse) {
      setIsPanelCollapsed(!isPanelCollapsed);

      // If we're collapsing the panel, also close the filter view
      if (
        !isPanelCollapsed &&
        toggleFilterDishesView &&
        isFilterDishesViewOpen
      ) {
        toggleFilterDishesView();
      }
    }
  };

  // Add separate function for handling filter view changes to avoid panel collapse
  const handleFilterViewChange = () => {
    // Set flag to prevent panel collapse when closing filter view
    setPreventPanelCollapse(true);

    // Clear the selected location when toggling filter view
    setSelectedLocation(null);

    // Toggle filter view
    if (toggleFilterDishesView) {
      toggleFilterDishesView();
    }

    // Reset flag after a short delay
    setTimeout(() => {
      setPreventPanelCollapse(false);
    }, 500);
  };

  // Filter locations based on active filters inside FoodMapLayout
  const filteredLocations = useMemo(() => {
    return activeFilters.length === 0
      ? locationsMap // Use the passed-in complete locationsMap
      : Object.fromEntries(
          Object.entries(locationsMap).filter(([dishName]) =>
            activeFilters.includes(dishName)
          )
        );
  }, [locationsMap, activeFilters]);

  // Combine all locations from the *filtered* locations for the map
  const allLocations = useMemo(() => {
    return Object.values(filteredLocations).flat();
  }, [filteredLocations]);

  // Check if we have any dishes to display
  const hasDishes = dishes.length > 0;

  return (
    <div className="h-screen w-full">
      {/* MOBILE VIEW */}
      <div className="lg:hidden flex flex-col h-screen">
        <section className="fixed top-0 z-30 w-full">
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
                isFilterDishesViewOpen={isFilterDishesViewOpen}
                toggleFilterDishesView={toggleFilterDishesView}
              />
            </div>
          )}

          {/* Map layer - always fills the container */}
          <MobileMapPanel
            filterUI={filterUI}
            hasDishes={hasDishes}
            locations={allLocations}
            onLocationClick={handleLocationClick}
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
            showBackButton={isPanelCollapsed}
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
                isFilterDishesViewOpen={isFilterDishesViewOpen}
                toggleFilterDishesView={toggleFilterDishesView}
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
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
};

export default FoodMapLayout;
