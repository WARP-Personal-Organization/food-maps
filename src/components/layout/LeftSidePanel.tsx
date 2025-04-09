'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Location } from '@/lib/locationData';
import LocationDetailPanel from '@/components/LocationDetailPanel';
import FilteredDishPanel from '@/components/food-map/FilteredDishPanel';
import FilterDishesView from '@/components/food-map/FilterDishesView';
import { ilonggoDishes } from '@/lib/dishData';

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
}) => {
  // Check if we have a single active filter (single dish selected)
  const singleFilterMode = activeFilters.length === 1;
  const activeDishFilter = singleFilterMode ? activeFilters[0] : null;
  const [shouldPreventCollapse, setShouldPreventCollapse] = useState(false);

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

    document.addEventListener('closeFilterViewOnly', handleCloseFilterViewOnly);

    return () => {
      document.removeEventListener(
        'closeFilterViewOnly',
        handleCloseFilterViewOnly
      );
    };
  }, []);

  // Effect to auto-collapse panel when no content is available
  useEffect(() => {
    // Reset the ref when dependencies change
    hasTriggeredCollapseRef.current = false;

    // If there's no location, no filter dishes view, and no single dish filter, collapse the panel
    if (
      !selectedLocation &&
      !isFilterDishesViewOpen &&
      !singleFilterMode &&
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
    singleFilterMode,
    onToggleCollapse,
    shouldPreventCollapse,
  ]);

  // Handler for when "X" is clicked to close the panel
  const handleClosePanel = () => {
    if (onToggleCollapse && !shouldPreventCollapse) {
      console.log('Collapsing panel from handleClosePanel');
      // Call immediately without timeout since this is directly triggered by user action
      onToggleCollapse();
    }
  };

  // Handler for closing the filter dishes view
  const handleCloseFilterDishesView = () => {
    console.log('handleCloseFilterDishesView triggered');
    // Toggle the filter view state
    if (toggleFilterDishesView) {
      console.log('Calling toggleFilterDishesView');
      toggleFilterDishesView();
    }

    // Collapse the panel if there's no single dish filter active
    if (onToggleCollapse && !singleFilterMode) {
      console.log('Calling onToggleCollapse');
      onToggleCollapse();
    }
  };

  // If there's nothing to display, return null to allow the panel to collapse
  if (!selectedLocation && !isFilterDishesViewOpen && !singleFilterMode) {
    return null;
  }

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

  // Mobile rendering for other panels
  if (isMobile) {
    return (
      <div className="absolute inset-0 z-40 bg-white overflow-y-auto">
        <div className="p-4">
          {isFilterDishesViewOpen ? (
            <FilterDishesView
              activeFilters={activeFilters}
              onFilterChange={onFilterChange}
              locationsMap={locationsMap}
              onClose={handleCloseFilterDishesView}
              isMobile={true}
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
          ) : null}
        </div>
      </div>
    );
  }

  // Desktop rendering
  return (
    <div className="w-full h-full overflow-hidden">
      {isFilterDishesViewOpen ? (
        <FilterDishesView
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          locationsMap={locationsMap}
          onClose={handleCloseFilterDishesView}
          isMobile={false}
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
      ) : null}
    </div>
  );
};

export default LeftSidePanel;
