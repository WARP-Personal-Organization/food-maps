'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/map.css';

// Define the Location interface
interface Location {
  name: string;
  x: number; // We'll convert these x,y coordinates to lng,lat for Mapbox
  y: number;
  description: string;
  iconType?: 'default' | 'restaurant' | 'shop' | 'attraction';
  iconUrl?: string;
  address?: string;
  openHours?: string;
  priceRange?: string;
  photos?: string[];
}

interface MapComponentProps {
  locations: Location[];
  mapImageUrl?: string; // URL to the custom map image (SVG or other formats)
  mapBounds: [[number, number], [number, number]]; // Bounds in [y, x] format: [[minY, minX], [maxY, maxX]]
  defaultZoom?: number;
  onLocationClick?: (location: Location) => void;
  mapboxToken?: string; // Mapbox access token
  mapStyle?: string; // Mapbox style URL
  useCustomMap?: boolean; // Whether to use a custom map image
}

const MapComponent: React.FC<MapComponentProps> = ({
  locations = [],
  mapImageUrl = '/map.svg', // Default to a map image in public
  mapBounds = [
    [0, 0],
    [1000, 1000],
  ],
  defaultZoom = 12,
  onLocationClick,
  mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    '', // Check both environment variables
  mapStyle = 'mapbox://styles/mapbox/streets-v12', // Default to streets style
  useCustomMap = false, // Default to using Mapbox's map
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mounted, setMounted] = useState(false);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const customMapRef = useRef<string | null>(null); // Reference to custom map source ID

  // Set Mapbox access token
  mapboxgl.accessToken = mapboxToken;

  // Helper function to convert our x,y coordinates to Mapbox lng,lat
  // Mapbox requires longitude values between -180 and 180, and latitude values between -90 and 90
  const xyToLngLat = (x: number, y: number): [number, number] => {
    // Convert your x,y coordinate system to valid Mapbox coordinates
    // This will depend on your specific coordinate system
    // For a simple approach, we'll scale the values to valid ranges:

    // For longitude (x): scale to range -180 to 180
    // For latitude (y): scale to range -85 to 85 (slightly less than 90 for safety)

    // Get the min/max bounds from the mapBounds
    const minX = mapBounds[0][1];
    const maxX = mapBounds[1][1];
    const minY = mapBounds[0][0];
    const maxY = mapBounds[1][0];

    // Calculate the normalized position (0 to 1) within the bounds
    const normalizedX = (x - minX) / (maxX - minX);
    const normalizedY = (y - minY) / (maxY - minY);

    // Convert to Mapbox coordinate ranges
    // Using a limited range to prevent repetition
    const lng = -30 + normalizedX * 60; // Scale to range -30 to 30
    const lat = -30 + normalizedY * 60; // Scale to range -30 to 30

    return [lng, lat];
  };

  // Set mounted state once component is mounted
  useEffect(() => {
    setMounted(true);
    return () => {
      // Cleanup map instance when component unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Initialize map when component mounts
  useEffect(() => {
    // Only run on client side and after component is mounted
    if (!mounted || !mapboxToken) return;

    // Initialize map only if container exists
    if (!mapContainerRef.current) return;

    // Clean up existing map instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Create a new map instance
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: useCustomMap ? 'mapbox://styles/mapbox/empty-v9' : mapStyle, // Use empty style if using custom map
      zoom: defaultZoom,
      center: [0, 0], // Center at the coordinate system origin
      attributionControl: false, // We'll add this manually in a better position
      renderWorldCopies: false, // Prevent the map from repeating across the world
    });

    // Add attribution control in the bottom-left corner
    map.addControl(new mapboxgl.AttributionControl(), 'bottom-left');

    // Add navigation controls (zoom, rotation) to the bottom-right corner
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    // Save reference to map instance
    mapInstanceRef.current = map;

    // Wait for the map to load before adding markers
    map.on('load', () => {
      // Apply custom background color to the map
      if (map.getStyle().layers) {
        // @ts-ignore
        const backgroundLayer = map
          .getStyle()
          .layers.find((layer) => layer.id === 'background');
        if (backgroundLayer) {
          map.setPaintProperty('background', 'background-color', '#3b3b3f');
        } else {
          map.addLayer(
            {
              id: 'background',
              type: 'background',
              paint: {
                'background-color': '#3b3b3f',
              },
            },
            'custom-map-layer'
          ); // Add before custom map layer if it exists
        }
      }

      // Convert mapBounds to Mapbox format
      const swCoord = xyToLngLat(mapBounds[0][1], mapBounds[0][0]);
      const neCoord = xyToLngLat(mapBounds[1][1], mapBounds[1][0]);
      const convertedBounds = new mapboxgl.LngLatBounds(swCoord, neCoord);

      // If using a custom map, add it as an image layer
      if (useCustomMap && mapImageUrl) {
        // Generate a unique source ID for the custom map
        const customMapSourceId = 'custom-map-' + Date.now();
        customMapRef.current = customMapSourceId;

        // Create a new image object to load the map image
        const mapImage = new Image();
        mapImage.onload = () => {
          // Once the image is loaded, add it as a source
          if (!map.hasImage('custom-map-image')) {
            map.addImage('custom-map-image', mapImage);
          }

          // Add the image as a source
          map.addSource(customMapSourceId, {
            type: 'image',
            url: mapImageUrl,
            coordinates: [
              [swCoord[0], neCoord[1]], // Top left [lng, lat]
              [neCoord[0], neCoord[1]], // Top right [lng, lat]
              [neCoord[0], swCoord[1]], // Bottom right [lng, lat]
              [swCoord[0], swCoord[1]], // Bottom left [lng, lat]
            ],
          });

          // Add a layer for the custom map
          map.addLayer({
            id: 'custom-map-layer',
            type: 'raster',
            source: customMapSourceId,
            paint: {
              'raster-opacity': 1,
            },
          });

          // Fit map to bounds
          map.fitBounds(convertedBounds, {
            padding: 20,
            maxZoom: Math.max(defaultZoom, 5),
          });

          // Add markers after the custom map is loaded
          addMarkers();
        };

        // Handle image loading errors
        mapImage.onerror = () => {
          console.error('Failed to load custom map image:', mapImageUrl);

          // Fallback to just showing markers
          map.fitBounds(convertedBounds, {
            padding: 20,
            maxZoom: Math.max(defaultZoom, 5),
          });

          addMarkers();
        };

        // Start loading the image
        mapImage.src = mapImageUrl;
      } else {
        // If not using custom map, just fit to bounds and add markers
        try {
          map.fitBounds(convertedBounds, {
            padding: 20,
            maxZoom: Math.max(defaultZoom, 5),
          });
        } catch (e) {
          console.error('Error fitting to bounds:', e);
        }

        // Add markers
        addMarkers();
      }
    });

    // Function to add markers to the map
    const addMarkers = () => {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Add new markers for each location
      locations.forEach((location) => {
        // Skip invalid locations
        if (
          typeof location.x !== 'number' ||
          typeof location.y !== 'number' ||
          isNaN(location.x) ||
          isNaN(location.y)
        ) {
          console.warn(`Skipping invalid location: ${location.name}`);
          return;
        }

        // Create a DOM element for the marker
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';

        // Add appropriate icon based on location type
        switch (location.iconType) {
          case 'restaurant':
            markerElement.innerHTML = `
              <div class="marker-icon restaurant-marker">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#4CAF50" d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                </svg>
              </div>
            `;
            break;
          case 'shop':
            markerElement.innerHTML = `
              <div class="marker-icon shop-marker">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#2196F3" d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 4c0 .55-.45 1-1 1s-1-.45-1-1V8h2v2zm3-4c1.1 0 2 .9 2 2H9c0-1.1.9-2 2-2zm3 4c0 .55-.45 1-1 1s-1-.45-1-1V8h2v2z"/>
                </svg>
              </div>
            `;
            break;
          case 'attraction':
            markerElement.innerHTML = `
              <div class="marker-icon attraction-marker">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#FFC107" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
            `;
            break;
          default:
            // Default marker or custom icon URL
            if (location.iconUrl) {
              markerElement.innerHTML = `<img src="${location.iconUrl}" alt="${location.name}" style="width: 24px; height: 24px;" />`;
            } else {
              markerElement.innerHTML = `
                <div class="marker-icon default-marker">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <circle cx="12" cy="12" r="8" fill="#FF5733" />
                  </svg>
                </div>
              `;
            }
        }

        // Convert x,y to lng,lat for Mapbox
        const [lng, lat] = xyToLngLat(location.x, location.y);

        // Create the marker and add it to the map
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([lng, lat])
          .addTo(map);

        // Add popup with location information
        marker.getElement().addEventListener('click', () => {
          // Remove existing popup if any
          if (popupRef.current) {
            popupRef.current.remove();
          }

          // Create a new popup
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setLngLat([lng, lat])
            .setHTML(`<b>${location.name}</b><br>${location.description}`)
            .addTo(map);

          // Store reference to popup
          popupRef.current = popup;

          // Call the onLocationClick callback if provided
          if (onLocationClick) {
            onLocationClick(location);
          }
        });

        // Add marker to references for cleanup
        markersRef.current.push(marker);
      });

      // If we have multiple locations, fit the map to show all markers
      if (locations.length > 1) {
        // Filter out invalid locations
        const validLocations = locations.filter(
          (loc) =>
            typeof loc.x === 'number' &&
            typeof loc.y === 'number' &&
            !isNaN(loc.x) &&
            !isNaN(loc.y)
        );

        if (validLocations.length > 0) {
          // Create a bounds object that encompasses all markers
          const bounds = new mapboxgl.LngLatBounds();

          // Extend bounds with each valid location
          validLocations.forEach((loc) => {
            const [lng, lat] = xyToLngLat(loc.x, loc.y);
            bounds.extend([lng, lat]);
          });

          // Fit the map to the bounds
          try {
            map.fitBounds(bounds, {
              padding: 50,
              maxZoom: Math.max(defaultZoom, 5),
            });
          } catch (e) {
            console.error('Error fitting to bounds:', e);
          }
        }
      } else if (locations.length === 1) {
        // Center on the single marker if it's valid
        const location = locations[0];
        if (
          typeof location.x === 'number' &&
          typeof location.y === 'number' &&
          !isNaN(location.x) &&
          !isNaN(location.y)
        ) {
          const [lng, lat] = xyToLngLat(location.x, location.y);
          map.setCenter([lng, lat]);
          map.setZoom(defaultZoom + 1);
        }
      }
    };

    // Add CSS for markers
    const style = document.createElement('style');
    style.textContent = `
      .custom-marker {
        cursor: pointer;
      }
      .marker-icon {
        width: 24px;
        height: 24px;
      }
    `;
    document.head.appendChild(style);

    // Return cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      style.remove();
    };
  }, [
    mapboxToken,
    mounted,
    mapStyle,
    locations,
    mapBounds,
    defaultZoom,
    onLocationClick,
    mapImageUrl,
    useCustomMap,
  ]);

  return (
    <div
      ref={mapContainerRef}
      className="h-full w-full z-10"
      style={{ position: 'relative' }}
    />
  );
};

export default MapComponent;
