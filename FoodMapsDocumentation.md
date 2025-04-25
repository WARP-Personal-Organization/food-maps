# Food Maps Application Documentation

## 1. How Mapbox is integrated with the app

The application integrates Mapbox through the `FoodMapRenderer` component, which is the core component for rendering maps. The integration follows these key steps:

```typescript
// src/components/FoodMapRenderer.tsx
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
```

The Mapbox access token is configured via environment variables:

```typescript
// src/components/FoodMapRenderer.tsx
const FoodMapRenderer: React.FC<MapComponentProps> = ({
  locations = [],
  mapImageUrl = '/Map.png',
  mapBounds = [
    [0, 0],
    [1000, 1000],
  ],
  defaultZoom = 12,
  onLocationClick,
  mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    '',
  mapStyle = 'mapbox://styles/mapbox/streets-v12',
  useCustomMap = false,
}) => {
```

The map is initialized in the `useEffect` hook:

```typescript
// src/components/FoodMapRenderer.tsx
const initializeMap = () => {
  console.log('Initializing map with', locations.length, 'locations');

  // Clean up existing map if it exists
  if (mapInstanceRef.current) {
    console.log('Removing existing map instance');
    mapInstanceRef.current.remove();
  }

  // Create a new map instance
  const map = new mapboxgl.Map({
    container: mapContainerRef.current!,
    style: useCustomMap ? 'mapbox://styles/mapbox/empty-v9' : mapStyle,
    zoom: defaultZoom,
    center: [0, 0],
    attributionControl: false,
    renderWorldCopies: false,
    interactive: true,
  });
```

To handle server-side rendering issues, the app uses dynamic imports with Next.js:

```typescript
// src/components/layout/MapUtilComponents.tsx
// Dynamically import the Map component to avoid SSR issues with Mapbox
// Using a stable key and memoization to prevent re-renders
const DynamicMapComponent = dynamic(
  () => import('@/components/FoodMapRenderer'),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-full w-full flex items-center justify-center"
        style={{ backgroundColor: '#3b3b3f' }}
      >
        <p className="text-white">Loading map...</p>
      </div>
    ),
  }
);
```

## 2. The process for adding a new restaurant to the map and to the codebase

To add a new restaurant to the map, you need to add it to the restaurant location data. The process involves:

1. Define the restaurant in the locationData.ts file under the appropriate dish:

```typescript
// src/lib/locationData.ts
// Map of dish names to their locations
export const dishLocations: Record<string, Location[]> = {
  Siopao: [
    {
      name: "Roberto's Siopao",
      x: 500,
      y: 300,
      description: 'Famous for their Siopao since 1978',
      iconType: 'restaurant',
      address: 'Rizal Street, La Paz Public Market, La Paz, Iloilo City',
      openHours: '10:00 AM - 9:00 PM',
      priceRange: '₱200-400',
      photos: [
        '/location-photos/robertos-1.jpg',
        '/location-photos/robertos-2.jpg',
        '/location-photos/robertos-3.jpg',
        '/location-photos/robertos-4.jpg',
      ],
    },
    {
      name: "Deco's",
      x: 700,
      y: 400,
      description: 'Home of the King-sized Siopao',
      iconType: 'restaurant',
      address: 'Iznart Street, Iloilo City',
      openHours: '8:00 AM - 8:00 PM',
      priceRange: '₱150-300',
    },
```

The Location interface defines the structure of restaurant data:

```typescript
// src/lib/locationData.ts
// Define Location interface
export interface Location {
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
```

When adding a new restaurant, you'll need to:

1. Choose the appropriate dish category in the `dishLocations` object
2. Add a new location object with required fields (name, x, y, description)
3. Add optional fields like iconType, iconUrl, address, etc.
4. Ensure the x and y coordinates align with the map bounds

## 3. Where the UI integration is included

The UI is primarily integrated through several key components:

1. The main FoodMapLayout component which structures the map and sidebar:

```typescript
// src/components/layout/FoodMapLayout.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Dish } from '@/lib/dishData';
import { Location } from '@/lib/locationData';
import FoodPrintsNavbar from '@/components/FoooPrintsNavbar';
import LeftSidePanel from './LeftSidePanel';
import RightSideMapPanel from './RightSideMapPanel';
```

2. The RightSideMapPanel component for desktop layout:

```typescript
// src/components/layout/RightSideMapPanel.tsx
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
            key={`fixed-map-desktop-${activeFilters
              .sort()
              .join('-')}-${isPanelCollapsed}`}
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
```

3. The MobileMapPanel component for mobile experience:

```typescript
// src/components/layout/MobileMapPanel.tsx
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
            mapImageUrl="/Map.png"
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
```

4. The main food-map page that brings everything together:

```typescript
// src/app/food-map/page.tsx
return (
  <div className="flex h-screen flex-col overflow-hidden">
    {/* The FoodMapLayout component is the main UI structure */}
    <FoodMapLayout
      dishes={ilonggoDishes}
      locationsMap={dishLocations}
      filterUI={
        <button
          onClick={toggleFilterDishesView}
          className="rounded-full bg-white p-3 shadow-lg"
          aria-label="Filter"
        >
          <svg className="h-6 w-6 text-gray-600" {...filterSvgProps} />
        </button>
      }
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      isFilterDishesViewOpen={isFilterViewOpen}
      toggleFilterDishesView={toggleFilterDishesView}
    />
  </div>
);
```

## 4. How all the modal component works and is integrated in the map

The application uses several modal components to enhance the user experience. These modals are implemented as React components and integrated with the map interface:

```typescript
// src/components/modals/BaseModal.tsx
'use client';

import { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createPortal } from 'react-dom';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        ref={modalRef}
        className={`${maxWidth} w-full rounded-lg bg-white p-6 shadow-xl`}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-xl font-bold">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto rounded-full p-1 hover:bg-gray-100"
            aria-label="Close modal"
          >
            <FaTimes className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default BaseModal;
```

### Location Detail Modal

The LocationDetailModal is displayed when a user clicks on a marker on the map:

```typescript
// src/components/modals/LocationDetailModal.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Tab } from '@headlessui/react';
import { Location } from '@/lib/locationData';
import BaseModal from './BaseModal';
import { FaClock, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';

interface LocationDetailModalProps {
  location: Location | null;
  isOpen: boolean;
  onClose: () => void;
}

const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  location,
  isOpen,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!location) return null;

  const handlePrevImage = () => {
    if (location.photos && location.photos.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? location.photos!.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (location.photos && location.photos.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === location.photos!.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex flex-col">
        <h2 className="mb-2 text-2xl font-bold">{location.name}</h2>
        <p className="mb-4 text-gray-700">{location.description}</p>

        <Tab.Group>
          <Tab.List className="mb-4 flex space-x-2 border-b">
            <Tab
              className={({ selected }) =>
                `px-4 py-2 focus:outline-none ${
                  selected
                    ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              Photos
            </Tab>
            <Tab
              className={({ selected }) =>
                `px-4 py-2 focus:outline-none ${
                  selected
                    ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              Details
            </Tab>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              {location.photos && location.photos.length > 0 ? (
                <div className="relative h-64 w-full overflow-hidden rounded-lg">
                  <Image
                    src={location.photos[currentImageIndex]}
                    alt={`${location.name} photo`}
                    fill
                    className="object-cover"
                  />

                  {location.photos.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white"
                        aria-label="Previous image"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white"
                        aria-label="Next image"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100">
                  <p className="text-gray-500">No photos available</p>
                </div>
              )}
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-4">
                {location.address && (
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mr-2 mt-1 h-5 w-5 text-gray-500" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-700">{location.address}</p>
                    </div>
                  </div>
                )}

                {location.openHours && (
                  <div className="flex items-start">
                    <FaClock className="mr-2 mt-1 h-5 w-5 text-gray-500" />
                    <div>
                      <h3 className="font-medium">Opening Hours</h3>
                      <p className="text-gray-700">{location.openHours}</p>
                    </div>
                  </div>
                )}

                {location.priceRange && (
                  <div className="flex items-start">
                    <FaDollarSign className="mr-2 mt-1 h-5 w-5 text-gray-500" />
                    <div>
                      <h3 className="font-medium">Price Range</h3>
                      <p className="text-gray-700">{location.priceRange}</p>
                    </div>
                  </div>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <div className="mt-6 flex space-x-3">
          <button
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            onClick={() =>
              window.open(
                `https://maps.google.com/?q=${location.name} ${location.address}`,
                '_blank'
              )
            }
          >
            Get Directions
          </button>
          <button
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default LocationDetailModal;
```

### Integration with the Map

The modal is integrated with the map through event handlers in the FoodMapRenderer component:

```typescript
// src/components/FoodMapRenderer.tsx
// Inside the useEffect that creates map markers
const handleMarkerClick = (location: Location) => {
  // Close any existing popups
  if (popupRef.current) {
    popupRef.current.remove();
  }

  // Create a popup for quick preview
  const popup = new mapboxgl.Popup({ offset: 25 })
    .setLngLat([location.x, location.y])
    .setHTML(`<b>${location.name}</b>`)
    .addTo(mapInstanceRef.current!);

  popupRef.current = popup;

  // Trigger the callback to show the modal
  if (onLocationClick) {
    onLocationClick(location);
  }
};

// Add click event listener to each marker
marker
  .getElement()
  .addEventListener('click', () => handleMarkerClick(location));
```

In the parent component, the modal state is managed and connected to the map:

```typescript
// src/components/layout/RightSideMapPanel.tsx
'use client';

import { useState } from 'react';
import { Location } from '@/lib/locationData';
import dynamic from 'next/dynamic';
import LocationDetailModal from '@/components/modals/LocationDetailModal';

// Dynamically load map component
const MapComponent = dynamic(() => import('@/components/FoodMapRenderer'), {
  ssr: false,
});

const RightSideMapPanel = ({ locations, isPanelCollapsed }) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className={`${isPanelCollapsed ? 'w-full' : 'flex-1'} relative h-full`}
    >
      <MapComponent
        locations={locations}
        onLocationClick={handleLocationClick}
        // ... other props
      />

      <LocationDetailModal
        location={selectedLocation}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default RightSideMapPanel;
```

### Filter Modal for Mobile

On mobile devices, a filter modal is used to allow users to select filters:

```typescript
// src/components/modals/FilterModal.tsx
'use client';

import { useMemo } from 'react';
import BaseModal from './BaseModal';
import { FaCheck } from 'react-icons/fa';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  availableFilters: Record<string, number>;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  activeFilters,
  onFilterChange,
  availableFilters,
}) => {
  const handleToggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      onFilterChange(activeFilters.filter((f) => f !== filter));
    } else {
      onFilterChange([...activeFilters, filter]);
    }
  };

  const handleClearAll = () => {
    onFilterChange([]);
  };

  const handleSelectAll = () => {
    onFilterChange(Object.keys(availableFilters));
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Filter Dishes">
      <div className="mb-4 flex justify-between">
        <button
          className="text-sm text-gray-500 hover:text-gray-700"
          onClick={handleClearAll}
        >
          Clear All
        </button>
        <button
          className="text-sm text-blue-500 hover:text-blue-700"
          onClick={handleSelectAll}
        >
          Select All
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {Object.entries(availableFilters).map(([filter, count]) => (
          <div
            key={filter}
            className="mb-2 flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
            onClick={() => handleToggleFilter(filter)}
          >
            <div>
              <span className="font-medium">{filter}</span>
              <span className="ml-2 text-sm text-gray-500">({count})</span>
            </div>
            {activeFilters.includes(filter) && (
              <FaCheck className="h-5 w-5 text-blue-500" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex">
        <button
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          onClick={onClose}
        >
          Apply Filters
        </button>
      </div>
    </BaseModal>
  );
};

export default FilterModal;
```

The modals enhance the user experience by providing detailed information and filtering capabilities without requiring page navigation. They are responsive and adapt to both desktop and mobile interfaces, making the application more user-friendly across different devices.

## 5. How the filtering system functions

The filtering system is implemented through several components:

1. The core filtering logic in FoodMapLayout processes locations based on active filters:

```typescript
// src/components/layout/FoodMapLayout.tsx
// Filter locations based on active filters inside FoodMapLayout
const filteredLocations = useMemo(() => {
  return activeFilters.length === 0
    ? locationsMap // Use the passed-in complete locationsMap
    : Object.fromEntries(
        Object.entries(locationsMap).filter(([dishName]) =>
          activeFilters.includes(dishName)
        )
      );
}, [locationsMap, activeFilters]);

// Combine all locations from the filtered locations for the map
const allLocations = useMemo(() => {
  const locations = Object.values(filteredLocations).flat();
  console.log(
    `Filtered to ${locations.length} locations from ${activeFilters.length} active filters`
  );
  return locations;
}, [filteredLocations, activeFilters.length]);
```

2. The FilterDishesView component provides the UI for selecting filters:

```typescript
// src/components/food-map/FilterDishesView.tsx
const FilterDishesView: React.FC<FilterDishesViewProps> = ({
  activeFilters,
  onFilterChange,
  locationsMap,
  onClose,
  isMobile = false,
}) => {
  // Filter implementation logic

  return (
    <div className={`${containerClasses} ${mobileClasses}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Filter Dishes</h2>
        <button
          onClick={handleClose}
          className="p-1.5 hover:bg-gray-100 rounded-full"
          aria-label="Close filter panel"
        >
          <svg className="h-6 w-6 text-gray-500" {...closeSvgProps} />
        </button>
      </div>

      {/* Filter UI implementation */}
    </div>
  );
};
```

3. The filtering system connects to the map through the active filters in MobileMapPanel and RightSideMapPanel:

```typescript
// src/components/layout/MobileMapPanel.tsx
<MapComponent
  key={`fixed-map-mobile-${activeFilters.sort().join('-')}`}
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
```

The filtering system works by:

1. Managing active filters in state
2. Filtering the locations based on selected dishes
3. Passing the filtered locations to the map component
4. Re-rendering the map when filters change
5. Providing UI components for selecting and viewing active filters
