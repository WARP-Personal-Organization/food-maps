'use client';

import React from 'react';
import { Location } from '@/lib/locationData';
import { FoodPrint } from '@/lib/foodPrintsData';
import { ClientOnly, MapComponent, EmptyState } from './MapUtilComponents';
import { useRouter } from 'next/navigation';

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
        <div className="absolute bottom-20 left-0 right-0 z-50 flex justify-center">
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-white bg-black/50 px-3 py-1 rounded-full mb-2">
              Filters ({activeFilters.length})
            </span>
            <div className="flex flex-wrap gap-2 justify-center">
              {activeFilters.map((filter) => (
                <div
                  key={filter}
                  className="bg-yellow-300 rounded-full pl-0 pr-2 py-0 text-gray-900 font-medium flex items-center shadow-sm text-sm border-2 border-blue-400"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                    <img
                      src={
                        filter === 'Siopao'
                          ? '/images/filter-dish/siopao.png'
                          : '/images/filter-dish/placeholder.jpg'
                      }
                      alt={filter}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="mx-1 font-semibold">{filter}</span>
                  <button
                    onClick={() => removeFilter(filter)}
                    className="ml-1 rounded-full w-5 h-5 flex items-center justify-center text-lg"
                    aria-label={`Remove ${filter} filter`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Back button at the bottom of the screen */}
      {showBackButton && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-50">
          <button
            onClick={handleBackToDishes}
            className="bg-white py-4 px-8 rounded-lg shadow-lg text-gray-800 font-semibold flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dishes
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileMapPanel;
