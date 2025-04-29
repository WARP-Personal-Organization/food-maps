'use client';

import React, { useEffect, useRef } from 'react';
import { Location } from '@/lib/locationData';
import { ClientOnly, MapComponent, EmptyState } from './MapUtilComponents';
import { foodPrintsData, FoodPrint } from '@/lib/foodprintData';

interface RightSideMapPanelProps {
  isPanelCollapsed: boolean;
  filterUI?: React.ReactNode;
  hasDishes: boolean;
  locations: Location[];
  onLocationClick: (location: Location) => void;
  activeFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
  onFoodprintClick?: (foodprint: FoodPrint) => void;
}

const RightSideMapPanel: React.FC<RightSideMapPanelProps> = ({
  isPanelCollapsed,
  filterUI,
  hasDishes,
  locations,
  onLocationClick,
  activeFilters = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onFilterChange,
  onFoodprintClick,
}) => {
  // Track previous panel collapse state to detect changes
  const prevCollapsedStateRef = useRef(isPanelCollapsed);

  // Handle panel collapse/expand transitions
  useEffect(() => {
    // Only trigger if there's a state change
    if (prevCollapsedStateRef.current !== isPanelCollapsed) {
      // Short delay to allow the CSS transition to complete
      const timer = setTimeout(() => {
        // Find the map element and trigger a resize event to recalculate dimensions
        const mapEl = document.querySelector('.mapboxgl-map');
        if (mapEl) {
          window.dispatchEvent(new Event('resize'));
        }
      }, 350); // Slightly longer than the CSS transition duration

      // Update ref with new state
      prevCollapsedStateRef.current = isPanelCollapsed;

      return () => clearTimeout(timer);
    }
  }, [isPanelCollapsed]);

  // Filter foodprint markers based on active filters
  const foodprintMarkers =
    activeFilters.length > 0
      ? foodPrintsData.markers.filter((marker) =>
          activeFilters.includes(marker.dishName)
        )
      : foodPrintsData.markers; // Show all markers when no filters are active

  console.log('Active filters:', activeFilters);
  console.log('Foodprint markers to display:', foodprintMarkers.length);

  return (
    <div
      className={`${
        isPanelCollapsed ? 'w-full' : 'flex-1'
      } relative h-full transition-all duration-300`}
    >
      <div
        className="relative h-full w-full overflow-hidden"
        style={{ backgroundColor: '#3b3b3f' }}
      >
        {/* Filter UI (button only) */}
        <div className="absolute top-6 left-6 z-[100]">{filterUI}</div>

        {hasDishes ? (
          <ClientOnly>
            <MapComponent
              key={`right-side-map-${activeFilters.join('-')}-${
                locations.length
              }-${isPanelCollapsed}`}
              locations={locations}
              foodPrintMarkers={foodprintMarkers}
              mapImageUrl="/Map.png"
              mapBounds={[
                [0, 0],
                [1000, 1000],
              ]}
              defaultZoom={3}
              onLocationClick={onLocationClick}
              onFoodPrintClick={onFoodprintClick}
              useCustomMap={true}
            />
          </ClientOnly>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default RightSideMapPanel;
