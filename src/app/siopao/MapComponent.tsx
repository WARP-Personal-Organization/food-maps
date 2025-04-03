'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import type { Map, Marker } from 'leaflet';

interface Location {
  name: string;
  x: number; // Changed from lat
  y: number; // Changed from lng
  description: string;
}

interface MapComponentProps {
  locations: Location[];
  mapImageUrl: string; // URL to the map image
  mapBounds: [[number, number], [number, number]]; // Bounds of the map in [y, x] format: [[minY, minX], [maxY, maxX]]
  defaultZoom?: number; // Optional default zoom level
}

const MapComponent: React.FC<MapComponentProps> = ({
  locations,
  mapImageUrl = '/map.svg', // Default to a map image in public
  mapBounds = [
    [0, 0],
    [1000, 1000],
  ], // Default map bounds
  defaultZoom = 0.4, // Default zoom level (0 is a medium zoom)
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);

  // Helper function to convert x,y to Leaflet's LatLng (which uses [y, x] format)
  const xy = (x: number, y: number) => {
    return [y, x] as [number, number];
  };

  // Initialize map when component mounts
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Dynamically import Leaflet only on client side
    const initializeMap = async () => {
      // Only load Leaflet once the component is mounted on client
      const L = (await import('leaflet')).default;

      // Clean up existing map instance if it exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Initialize map only if container exists
      if (!mapContainerRef.current) return;

      // Create the map instance with CRS.Simple
      const map = L.map(mapContainerRef.current, {
        crs: L.CRS.Simple,
        minZoom: -3, // Allow zooming out further to see the entire map
        maxZoom: 3, // Limit how far users can zoom in
      });

      // Add the image overlay with the map bounds
      L.imageOverlay(mapImageUrl, mapBounds).addTo(map);

      // Set view to fit all the image
      map.fitBounds(mapBounds);

      // Apply default zoom if specified (after fitting bounds)
      if (defaultZoom !== undefined) {
        map.setZoom(defaultZoom);
      }

      // Create custom icon for markers
      const customIcon = L.divIcon({
        className: 'custom-pin',
        html: `
          <div style="width: 24px; height: 24px; transform: translate(-12px, -12px);">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#FF5733">
              <circle cx="12" cy="12" r="8" />
            </svg>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      });

      // Save reference to map instance
      mapInstanceRef.current = map;

      // Add markers
      if (locations && locations.length > 0) {
        // Clear existing markers
        markersRef.current.forEach((marker) => {
          if (marker) marker.remove();
        });
        markersRef.current = [];

        // Add new markers
        locations.forEach((location) => {
          // Use the xy helper to convert x,y to LatLng format
          const position = xy(location.x, location.y);
          const marker = L.marker(position, {
            icon: customIcon,
          }).addTo(map);

          marker.bindPopup(
            `<b>${location.name}</b><br>${location.description}`
          );
          markersRef.current.push(marker);
        });

        // Adjust view to show all markers if needed
        if (locations.length > 1) {
          const points = locations.map((loc) => xy(loc.x, loc.y));
          const bounds = L.latLngBounds(points);
          map.fitBounds(bounds, { padding: [50, 50] });
        } else if (locations.length === 1) {
          const [y, x] = xy(locations[0].x, locations[0].y);
          map.setView([y, x], 0);
        }
      }
    };

    // Initialize the map
    initializeMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, [locations, mapImageUrl, mapBounds, defaultZoom]); // Re-run when locations, mapImageUrl, mapBounds or defaultZoom change

  return <div ref={mapContainerRef} className="h-full w-full z-0" />;
};

export default MapComponent;
