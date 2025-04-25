'use client';

import React from 'react';
import { Location } from '@/lib/locationData';
import { FoodPrint } from '@/lib/foodPrintsData';
import { ClientOnly, MapComponent, EmptyState } from './MapUtilComponents';
import { useRouter } from 'next/navigation';
import { IoClose, IoReturnUpBackSharp } from 'react-icons/io5';

interface MobileMapPanelProps {
  filterUI?: React.ReactNode;
  hasDishes: boolean;
  locations: Location[];
  foodPrintMarkers?: FoodPrint[];
  onLocationClick: (location: Location) => void;
  onFoodPrintClick?: (foodPrint: FoodPrint) => void;
  showBackButton?: boolean;
  activeFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
}

const MobileMapPanel: React.FC<MobileMapPanelProps> = ({
  filterUI,
  hasDishes,
  locations,
  foodPrintMarkers = [],
  onLocationClick,
  onFoodPrintClick,
  showBackButton = true,
  activeFilters = [],
  onFilterChange,
}) => {
  const router = useRouter();

  const handleBackToDishes = () => {
    router.push('/');
  };

  const removeFilter = (filterName: string) => {
    if (onFilterChange) {
      onFilterChange(activeFilters.filter((filter) => filter !== filterName));
    }
  };

  return (
    <div className="absolute inset-0 z-20 w-full">
      {/* Filter UI on mobile - top left of map */}
      {filterUI && (
        <div className="fixed top-20 left-4 z-[100] max-w-[85%] cursor-pointer">
          {filterUI}
        </div>
      )}

      {hasDishes ? (
        <ClientOnly>
          <div className="h-full w-full" style={{ backgroundColor: '#3b3b3f' }}>
            <MapComponent
              key={`fixed-map-mobile-${activeFilters.sort().join('-')}`}
              locations={locations}
              foodPrintMarkers={foodPrintMarkers}
              mapImageUrl="/Map.png"
              mapBounds={[
                [0, 0],
                [1000, 1000],
              ]}
              defaultZoom={3}
              onLocationClick={onLocationClick}
              onFoodPrintClick={onFoodPrintClick}
              useCustomMap={true}
            />
          </div>
        </ClientOnly>
      ) : (
        <EmptyState />
      )}

      {/* Active Filters UI */}
      {activeFilters.length > 0 && (
        <div className="absolute bottom-25 left-0 z-50 flex justify-start px-4">
          <div className="flex flex-col items-start">
            <span
              className="text-xs font-medium text-white px-3 py-1 rounded-full mb-2 bg-black/20">
              Filters ({activeFilters.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <div
                  key={filter}
                  className="bg-yellow-300 rounded-full pl-0 pr-2 py-0 text-gray-900 font-medium flex items-center shadow-sm text-sm border-2 border-blue-400"
                >
                  <div className="w-2 h-10"></div>
                  <span className="mx-1 font-semibold px-2 py-1">{filter}</span>
                  <button
                    onClick={() => removeFilter(filter)}
                    className="rounded-full w-5 h-5 flex items-center justify-center text-lg"
                    aria-label={`Remove ${filter} filter`}
                  >
                    <IoClose className="w-4 h-4 text-gray-800" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* Back button at the bottom of the screen */}
      {showBackButton && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-50 px-4">
          <button
            onClick={handleBackToDishes}
            className="w-full max-w-md bg-white py-4 px-8 rounded-lg shadow-lg text-gray-800 font-semibold flex items-center justify-center text-center"
          >
            <IoReturnUpBackSharp className="w-5 h-5 mr-2" />
            Back to Dishes
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileMapPanel;
