'use client';

import React, { useState, useEffect } from 'react';
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

  // Handler for when "X" is clicked to close the panel
  const handleClosePanel = () => {
    if (onToggleCollapse && !shouldPreventCollapse) {
      onToggleCollapse();
    }
  };

  // Handler for closing the filter dishes view
  const handleCloseFilterDishesView = () => {
    // Toggle the filter view state
    if (toggleFilterDishesView) {
      toggleFilterDishesView();
    }

    // Collapse the panel if there's no single dish filter active
    if (onToggleCollapse && !singleFilterMode) {
      onToggleCollapse();
    }
  };

  // Mobile rendering adds extra wrapper and classes
  if (isMobile) {
    return (
      <div className="absolute inset-0 z-40 bg-white">
        {selectedLocation ? (
          <LocationDetailPanel
            location={selectedLocation}
            onClose={closeLocationDetail}
          />
        ) : isFilterDishesViewOpen ? (
          <FilterDishesView
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
            locationsMap={locationsMap}
            onClose={handleCloseFilterDishesView}
          />
        ) : singleFilterMode ? (
          <FilteredDishPanel
            dishes={ilonggoDishes}
            activeFilter={activeDishFilter}
            onClose={handleClosePanel}
          />
        ) : (
          // Show a blank panel when no specific content is available
          <div className="flex h-full items-center justify-center p-8 text-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                No dish selected
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Select a dish from the filter menu to see more details.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop rendering
  return (
    <div className="w-full h-full overflow-hidden">
      {selectedLocation ? (
        <LocationDetailPanel
          location={selectedLocation}
          onClose={closeLocationDetail}
        />
      ) : isFilterDishesViewOpen ? (
        <FilterDishesView
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          locationsMap={locationsMap}
          onClose={handleCloseFilterDishesView}
        />
      ) : singleFilterMode ? (
        <FilteredDishPanel
          dishes={ilonggoDishes}
          activeFilter={activeDishFilter}
          onClose={handleClosePanel}
        />
      ) : (
        // Show a blank panel when no specific content is available
        <div className="flex h-full items-center justify-center p-8 text-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              No dish selected
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Select a dish from the filter menu to see more details.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSidePanel;
