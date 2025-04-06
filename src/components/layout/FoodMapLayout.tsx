'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Dish } from '@/lib/dishData';
import DishDetailPanel from '@/components/dishes/DishDetailPanel';
import LocationDetailPanel from '@/components/LocationDetailPanel';
import FoodPrintsNavbar from '@/components/FoooPrintsNavbar';

// Define Location interface to match with MapComponent
interface Location {
  name: string;
  x: number;
  y: number;
  description: string;
  iconType?: 'default' | 'restaurant' | 'shop' | 'attraction';
  iconUrl?: string;
  address?: string;
  openHours?: string;
  priceRange?: string;
  photos?: string[];
}

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
}

const FoodMapLayout: React.FC<FoodMapLayoutProps> = ({
  dishes,
  locationsMap,
  filterUI,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const nextDish = () => {
    setActiveIndex((prev) => (prev + 1) % dishes.length);
    setSelectedLocation(null); // Reset selected location when changing dish
  };

  const prevDish = () => {
    setActiveIndex((prev) => (prev - 1 + dishes.length) % dishes.length);
    setSelectedLocation(null); // Reset selected location when changing dish
  };

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const closeLocationDetail = () => {
    setSelectedLocation(null);
  };

  // Get locations for the current active dish
  const currentDishName = dishes[activeIndex]?.name || '';
  const currentLocations = locationsMap[currentDishName] || [];

  // Check if we have any dishes to display
  const hasDishes = dishes.length > 0;

  // Reset active index if we have dishes but the current index is out of bounds
  React.useEffect(() => {
    if (hasDishes && activeIndex >= dishes.length) {
      setActiveIndex(0);
    }
  }, [dishes, hasDishes, activeIndex]);

  return (
    <div className="h-screen w-full">
      {/* MOBILE VIEW */}
      <div className="lg:hidden flex flex-col h-screen">
        <section className="fixed top-0 z-50 w-full">
          <FoodPrintsNavbar />
        </section>

        <div className="h-full w-full pt-16">
          {selectedLocation ? (
            <div className="absolute inset-0 z-40 pt-16 p-4">
              <LocationDetailPanel
                location={selectedLocation}
                onClose={closeLocationDetail}
              />
            </div>
          ) : null}
          <div className="relative h-full w-full">
            {/* Filter UI on mobile - top left of map */}
            {filterUI && (
              <div className="absolute top-4 left-4 z-50 max-w-[85%]">
                {filterUI}
              </div>
            )}

            {hasDishes ? (
              <ClientOnly>
                <MapComponent
                  locations={currentLocations}
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
        <div className="w-[30%] flex flex-col justify-center items-center p-10">
          {selectedLocation ? (
            <LocationDetailPanel
              location={selectedLocation}
              onClose={closeLocationDetail}
            />
          ) : hasDishes ? (
            <DishDetailPanel
              dishes={dishes}
              activeIndex={activeIndex}
              onPrevDish={prevDish}
              onNextDish={nextDish}
            />
          ) : (
            <div className="text-center p-6">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No dishes selected
              </h3>
              <p className="text-gray-500">
                Please select at least one dish from the filter above.
              </p>
            </div>
          )}
        </div>

        {/* Right Side - Map (70% Width) */}
        <div className="w-[70%] relative h-full">
          <div className="relative h-full w-full">
            {/* Filter UI on desktop - top left of map */}
            {filterUI && (
              <div className="absolute top-6 left-6 z-[100]">{filterUI}</div>
            )}

            {hasDishes ? (
              <ClientOnly>
                <MapComponent
                  locations={currentLocations}
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
