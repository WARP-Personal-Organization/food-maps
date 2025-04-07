'use client';

import React from 'react';
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
}

const LeftSidePanel: React.FC<LeftSidePanelProps> = ({
  selectedLocation,
  closeLocationDetail,
  activeFilters,
  onFilterChange,
  locationsMap,
  isMobile = false,
  onToggleCollapse,
}) => {
  // Check if we have a single active filter (single dish selected)
  const singleFilterMode = activeFilters.length === 1;
  const activeDishFilter = singleFilterMode ? activeFilters[0] : null;

  // Handler for when "X" is clicked to close the panel
  const handleClosePanel = () => {
    if (onToggleCollapse) {
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
        ) : singleFilterMode ? (
          <FilteredDishPanel
            dishes={ilonggoDishes}
            activeFilter={activeDishFilter}
            onClose={handleClosePanel}
          />
        ) : (
          <FilterDishesView
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
            locationsMap={locationsMap}
            onClose={handleClosePanel}
          />
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
      ) : singleFilterMode ? (
        <FilteredDishPanel
          dishes={ilonggoDishes}
          activeFilter={activeDishFilter}
          onClose={handleClosePanel}
        />
      ) : (
        <FilterDishesView
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          locationsMap={locationsMap}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
};

export default LeftSidePanel;
