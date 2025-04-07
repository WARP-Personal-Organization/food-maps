'use client';

import React from 'react';
import { Location } from '@/lib/locationData';
import { ClientOnly, MapComponent, EmptyState } from './MapUtilComponents';

interface MobileMapPanelProps {
  filterUI?: React.ReactNode;
  hasDishes: boolean;
  locations: Location[];
  onLocationClick: (location: Location) => void;
}

const MobileMapPanel: React.FC<MobileMapPanelProps> = ({
  filterUI,
  hasDishes,
  locations,
  onLocationClick,
}) => {
  return (
    <div className="absolute inset-0 z-20">
      {/* Filter UI on mobile - top left of map */}
      {filterUI && (
        <div className="absolute top-4 left-4 z-50 max-w-[85%]">{filterUI}</div>
      )}

      {hasDishes ? (
        <ClientOnly>
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
        </ClientOnly>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default MobileMapPanel;
