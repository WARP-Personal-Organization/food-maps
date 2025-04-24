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

## 4. How the location detail panel works and is integrated in the map

The location detail functionality is implemented through the `LocationDetailPanel` component:

```typescript
// src/components/LocationDetailPanel.tsx
'use client';

import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import { Location } from '@/lib/locationData';
import LocationActionButtons from './LocationActionButtons';

interface LocationDetailPanelProps {
  location: Location | null;
  onClose: () => void;
}

const LocationDetailPanel: React.FC<LocationDetailPanelProps> = ({
  location,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('photos');

  if (!location) return null;

  // Component implementation...
};
```

The panel is integrated through the marker click handler in the FoodMapRenderer:

```typescript
// src/components/FoodMapRenderer.tsx
// Add popup and click handler
marker.getElement().addEventListener('click', () => {
  if (popupRef.current) {
    popupRef.current.remove();
  }

  const popup = new mapboxgl.Popup({ offset: 25 })
    .setLngLat([lng, lat])
    .setHTML(`<b>${location.name}</b><br>${location.description}`)
    .addTo(map);

  popupRef.current = popup;

  if (onLocationClick) {
    onLocationClick(location);
  }
});
```

When a marker is clicked on the map, the `onLocationClick` callback is triggered, which typically opens the `LocationDetailPanel` for the selected location in the side panel of the application.

The `LocationDetailPanel` is responsive and adapts to different screen sizes, displaying restaurant information in a user-friendly format with tabs for photos and menu details.

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
