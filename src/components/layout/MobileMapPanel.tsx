'use client';

import React from 'react';
import { Location } from '@/lib/locationData';
import { ClientOnly, MapComponent, EmptyState } from './MapUtilComponents';
import { useRouter } from 'next/navigation';

interface MobileMapPanelProps {
  filterUI?: React.ReactNode;
  hasDishes: boolean;
  locations: Location[];
  onLocationClick: (location: Location) => void;
  showBackButton?: boolean;
}

const MobileMapPanel: React.FC<MobileMapPanelProps> = ({
  filterUI,
  hasDishes,
  locations,
  onLocationClick,
  showBackButton = true,
}) => {
  const router = useRouter();

  const handleBackToDishes = () => {
    router.push('/');
  };

  return (
    <div className="absolute inset-0 z-20">
      {/* Filter UI on mobile - top left of map */}
      {filterUI && (
        <div className="fixed top-20 left-4 z-[100] max-w-[85%] bg-white rounded-lg shadow-lg p-4">
          {filterUI}
        </div>
      )}

      {hasDishes ? (
        <ClientOnly>
          <div className="h-full w-full">
            <MapComponent
              locations={locations}
              mapImageUrl="/map.png"
              mapBounds={[
                [0, 0],
                [1000, 1000],
              ]}
              defaultZoom={3}
              onLocationClick={onLocationClick}
              useCustomMap={true}
            />
          </div>
        </ClientOnly>
      ) : (
        <EmptyState />
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
