'use client';

import React, { useEffect, useRef } from 'react';
import { Location } from '@/lib/locationData';
import { ClientOnly, MapComponent, EmptyState } from './MapUtilComponents';

interface RightSideMapPanelProps {
  isPanelCollapsed: boolean;
  filterUI?: React.ReactNode;
  hasDishes: boolean;
  locations: Location[];
  onLocationClick: (location: Location) => void;
  activeFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
}

const RightSideMapPanel: React.FC<RightSideMapPanelProps> = ({
  isPanelCollapsed,
  filterUI,
  hasDishes,
  locations,
  onLocationClick,
  activeFilters = [],
  onFilterChange,
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

  // Function to remove a filter
  const removeFilter = (filterName: string) => {
    if (onFilterChange) {
      onFilterChange(activeFilters.filter((filter) => filter !== filterName));
    }
  };

  return (
    <div
      className={`${
        isPanelCollapsed ? 'w-full' : 'w-[70%]'
      } relative h-full transition-all duration-300`}
    >
      <div className="relative h-full w-full overflow-hidden">
        {/* Filter UI and Active Filters container */}
        <div className="absolute top-6 left-6 z-[100] flex flex-wrap gap-2 items-center">
          {/* Filter UI (button) */}
          {filterUI}

          {/* Active Filter Pills - only shown when filters are active */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 max-w-[500px]">
              {activeFilters.map((filter) => (
                <div
                  key={filter}
                  className="bg-yellow-300 rounded-full px-4 py-1.5 text-gray-900 font-medium flex items-center gap-2 shadow-sm text-sm"
                >
                  <span>{filter}</span>
                  <button
                    onClick={() => removeFilter(filter)}
                    className="hover:bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                    aria-label={`Remove ${filter} filter`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {hasDishes ? (
          <ClientOnly>
            <MapComponent
              key={`right-side-map-${activeFilters.join('-')}-${
                locations.length
              }-${isPanelCollapsed}`}
              locations={locations}
              mapImageUrl="/Map.png"
              mapBounds={[
                [0, 0],
                [1000, 1000],
              ]}
              defaultZoom={3}
              onLocationClick={onLocationClick}
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
