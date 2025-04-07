'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Dish } from '@/lib/dishData';
import { Location } from '@/lib/locationData';
import FoodPrintsNavbar from '@/components/FoooPrintsNavbar';
import LeftSidePanel from './LeftSidePanel';

// Client Component wrapper for map
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <p>Loading map...</p>
      </div>
    );
  }

  return <>{children}</>;
};

// Dynamically import the Map component to avoid SSR issues with Mapbox
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <p>Loading map...</p>
    </div>
  ),
});

// Empty state component to show when no dishes are selected
const EmptyState = () => (
  <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100">
    <svg
      className="w-16 h-16 text-gray-400 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
    <h3 className="text-xl font-medium text-gray-700 mb-2">
      No dishes selected
    </h3>
    <p className="text-gray-500 text-center max-w-xs">
      Please select at least one dish from the filter above to view locations on
      the map.
    </p>
  </div>
);

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

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const closeLocationDetail = () => {
    setSelectedLocation(null);
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

        <div className="h-full w-full pt-16">
          <LeftSidePanel
            selectedLocation={selectedLocation}
            closeLocationDetail={closeLocationDetail}
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
            locationsMap={locationsMap}
            isMobile={true}
          />
          <div className="relative h-full w-full">
            {/* Filter UI on mobile - top left of map */}
            {filterUI && activeFilters.length > 0 && (
              <div className="absolute top-4 left-4 z-50 max-w-[85%]">
                {filterUI}
              </div>
            )}

            {hasDishes ? (
              <ClientOnly>
                <MapComponent
                  locations={allLocations}
                  mapImageUrl="/map.png"
                  mapBounds={[
                    [0, 0],
                    [1000, 1000],
                  ]}
                  defaultZoom={3}
                  onLocationClick={handleLocationClick}
                  useCustomMap={true}
                />
              </ClientOnly>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden lg:flex h-screen w-full bg-white">
        {/* Left Side - Text Content (30% Width) */}
        <div className="w-[30%] h-full overflow-hidden">
          <LeftSidePanel
            selectedLocation={selectedLocation}
            closeLocationDetail={closeLocationDetail}
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
            locationsMap={locationsMap}
          />
        </div>

        {/* Right Side - Map (70% Width) */}
        <div className="w-[70%] relative h-full">
          <div className="relative h-full w-full">
            {/* Filter UI on desktop - top left of map */}
            {filterUI && activeFilters.length > 0 && (
              <div className="absolute top-6 left-6 z-[100]">{filterUI}</div>
            )}

            {hasDishes ? (
              <ClientOnly>
                <MapComponent
                  locations={allLocations}
                  mapImageUrl="/map.png"
                  mapBounds={[
                    [0, 0],
                    [1000, 1000],
                  ]}
                  defaultZoom={3}
                  onLocationClick={handleLocationClick}
                  useCustomMap={true}
                />
              </ClientOnly>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodMapLayout;
