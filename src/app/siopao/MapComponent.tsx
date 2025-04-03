'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import type { Map, Marker } from 'leaflet';

interface Location {
  name: string;
  x: number; // Changed from lat
  y: number; // Changed from lng
  description: string;
  iconType?: 'default' | 'restaurant' | 'shop' | 'attraction'; // Add icon type option
  iconUrl?: string; // Add custom icon URL option
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
    // Add validation to ensure x and y are numbers
    if (
      typeof x !== 'number' ||
      typeof y !== 'number' ||
      isNaN(x) ||
      isNaN(y)
    ) {
      console.warn(`Invalid coordinates: x=${x}, y=${y}`);
      return [0, 0] as [number, number]; // Return a default value instead of undefined
    }
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
        zoomControl: false, // Disable default zoom control to position it manually
      });

      // Add custom zoom control to the lower right corner
      L.control
        .zoom({
          position: 'bottomright',
        })
        .addTo(map);

      // Add the image overlay with the map bounds
      L.imageOverlay(mapImageUrl, mapBounds).addTo(map);

      // Set view to fit all the image
      map.fitBounds(mapBounds);

      // Apply default zoom if specified (after fitting bounds)
      if (defaultZoom !== undefined) {
        map.setZoom(defaultZoom);
      }

      // Define custom marker icons
      const createCustomIcon = (
        iconType: 'default' | 'restaurant' | 'shop' | 'attraction',
        iconUrl?: string
      ) => {
        // If a custom icon URL is provided, use that instead
        if (iconUrl) {
          return L.icon({
            iconUrl: iconUrl,
            iconSize: [40, 52], // Size of the icon
            iconAnchor: [20, 52], // Point of the icon which corresponds to marker's location
            popupAnchor: [0, -52], // Point from which the popup should open relative to the iconAnchor
          });
        }

        // Otherwise use the default SVG icons
        let iconHtml = '';
        const iconColor = '#FF5733';

        switch (iconType) {
          case 'restaurant':
            // Restaurant icon (utensils)
            iconHtml = `
              <div class="custom-marker restaurant-marker">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#4CAF50" d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                </svg>
              </div>
            `;
            break;
          case 'shop':
            // Shop icon (shopping bag)
            iconHtml = `
              <div class="custom-marker shop-marker">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#2196F3" d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 4c0 .55-.45 1-1 1s-1-.45-1-1V8h2v2zm3-4c1.1 0 2 .9 2 2H9c0-1.1.9-2 2-2zm3 4c0 .55-.45 1-1 1s-1-.45-1-1V8h2v2z"/>
                </svg>
              </div>
            `;
            break;
          case 'attraction':
            // Attraction icon (star)
            iconHtml = `
              <div class="custom-marker attraction-marker">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#FFC107" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
            `;
            break;
          default:
            // Default circular marker
            iconHtml = `
              <div class="custom-marker default-marker">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <circle cx="12" cy="12" r="8" fill="${iconColor}" />
                </svg>
              </div>
            `;
        }

        return L.divIcon({
          className: 'custom-pin',
          html: iconHtml,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -12],
        });
      };

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
          // Validate location coordinates before creating a marker
          if (
            typeof location.x !== 'number' ||
            typeof location.y !== 'number' ||
            isNaN(location.x) ||
            isNaN(location.y)
          ) {
            console.warn(`Skipping invalid location: ${location.name}`);
            return; // Skip this location
          }

          // Use the xy helper to convert x,y to LatLng format
          const position = xy(location.x, location.y);

          // Create marker with custom icon based on location type
          const markerIcon = createCustomIcon(
            location.iconType || 'default',
            location.iconUrl
          );

          const marker = L.marker(position, {
            icon: markerIcon,
          }).addTo(map);

          marker.bindPopup(
            `<b>${location.name}</b><br>${location.description}`
          );
          markersRef.current.push(marker);
        });

        // Adjust view to show all markers if needed
        if (locations.length > 1) {
          // Filter out any invalid locations before creating bounds
          const validLocations = locations.filter(
            (loc) =>
              typeof loc.x === 'number' &&
              typeof loc.y === 'number' &&
              !isNaN(loc.x) &&
              !isNaN(loc.y)
          );

          if (validLocations.length > 0) {
            const points = validLocations.map((loc) => xy(loc.x, loc.y));
            try {
              const bounds = L.latLngBounds(points);
              map.fitBounds(bounds, { padding: [50, 50] });
            } catch (error) {
              console.error('Error creating bounds:', error);
              // Fallback to fit the map bounds
              map.fitBounds(mapBounds);
            }
          } else {
            // If no valid locations, just fit to map bounds
            map.fitBounds(mapBounds);
          }
        } else if (locations.length === 1) {
          const location = locations[0];
          if (
            typeof location.x === 'number' &&
            typeof location.y === 'number' &&
            !isNaN(location.x) &&
            !isNaN(location.y)
          ) {
            const [y, x] = xy(location.x, location.y);
            map.setView([y, x], 0);
          } else {
            // Fallback to map bounds if the single location is invalid
            map.fitBounds(mapBounds);
          }
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
