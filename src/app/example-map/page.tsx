'use client';

import React, { useState } from 'react';
import FoodMapRenderer from '../../components/FoodMapRenderer';
import { Location } from '@/lib/locationData';

export default function ExampleMapPage() {
  // State to toggle between standard map and custom map
  const [useCustomMap, setUseCustomMap] = useState(false);

  // Example locations
  const locations: Location[] = [
    {
      name: 'Restaurant A',
      x: 20,
      y: 30,
      description: 'A delicious restaurant with local cuisine',
      iconType: 'restaurant',
      iconUrl: '/siopao-1.png',
    },
    {
      name: 'Shop B',
      x: 30,
      y: 40,
      description: 'A popular shopping destination',
      iconType: 'shop',
      iconUrl: '/siopao-2.png',
    },
    {
      name: 'Attraction C',
      x: 25,
      y: 35,
      description: 'A must-visit tourist attraction',
      iconType: 'attraction',
      iconUrl: '/siopao-3.png',
    },
  ];

  // Example map bounds (coordinates in [y, x] format)
  const mapBounds: [[number, number], [number, number]] = [
    [0, 0], // [minY, minX]
    [100, 100], // [maxY, maxX]
  ];

  const handleLocationClick = (location: Location) => {
    console.log('Location clicked:', location.name);
    // You could show more details, open a modal, etc.
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Example Map</h1>

      <div className="mb-4">
        <p>This is an example of the FoodMapRenderer using Mapbox GL JS.</p>
        <p>Click on a marker to see more information about the location.</p>

        {/* Toggle button for custom map */}
        <div className="mt-4 mb-4">
          <button
            onClick={() => setUseCustomMap(!useCustomMap)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {useCustomMap
              ? 'Switch to Standard Map'
              : 'Switch to Custom SVG Map'}
          </button>
          <p className="mt-2 text-sm text-gray-600">
            {useCustomMap
              ? 'Currently showing custom SVG map overlay'
              : 'Currently showing standard Mapbox map'}
          </p>
        </div>
      </div>

      {/* Map container with fixed height */}
      <div className="h-[600px] w-full border border-gray-300 rounded-lg overflow-hidden">
        <FoodMapRenderer
          locations={locations}
          mapBounds={mapBounds}
          defaultZoom={11}
          onLocationClick={handleLocationClick}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapImageUrl="/Map.svg" // Path to your custom map SVG in the public folder (make sure to use uppercase 'M')
          useCustomMap={useCustomMap} // Pass the state to control which map to show
        />
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Locations</h2>
        <ul className="list-disc pl-5">
          {locations.map((location, index) => (
            <li key={index} className="mb-2">
              <strong>{location.name}</strong> - {location.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
