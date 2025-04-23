'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/map.css';
import { Location } from '@/lib/locationData';

interface MapComponentProps {
  locations: Location[];
  mapImageUrl?: string;
  mapBounds: [[number, number], [number, number]];
  defaultZoom?: number;
  onLocationClick?: (location: Location) => void;
  mapboxToken?: string;
  mapStyle?: string;
  useCustomMap?: boolean;
}

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mounted, setMounted] = useState(false);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const customMapRef = useRef<string | null>(null);
  const mapInitializedRef = useRef<boolean>(false);
  const [locationsSnapshot, setLocationsSnapshot] = useState<Location[]>([]);

  // Set Mapbox access token
  mapboxgl.accessToken = mapboxToken;

  // Helper function to convert our x,y coordinates to Mapbox lng,lat
  const xyToLngLat = (x: number, y: number): [number, number] => {
    // Get the min/max bounds from the mapBounds
    const minX = mapBounds[0][1];
    const maxX = mapBounds[1][1];
    const minY = mapBounds[0][0];
    const maxY = mapBounds[1][0];

    // Calculate the normalized position (0 to 1) within the bounds
    const normalizedX = (x - minX) / (maxX - minX);
    const normalizedY = (y - minY) / (maxY - minY);

    // Convert to Mapbox coordinate ranges - using a wider range
    const lng = -40 + normalizedX * 80; // Scale to range -40 to 40
    const lat = -40 + normalizedY * 80; // Scale to range -40 to 40

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
        mapInitializedRef.current = false;
      }
    };
  }, []);

  // Force render markers whenever locations change
  useEffect(() => {
    const locationsDiff =
      JSON.stringify(locations) !== JSON.stringify(locationsSnapshot);
    if (locationsDiff) {
      setLocationsSnapshot(locations);
      console.log('Locations changed, will update markers');
    }
  }, [locations]);

  // Main effect to initialize map or update markers
  useEffect(() => {
    // Only run on client side
    if (!mounted || !mapboxToken || !mapContainerRef.current) return;

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

      // Function to add markers to the map
      const addMarkers = () => {
        console.log(`Adding ${locations.length} markers to map`);

        // Clear existing markers
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        // Get valid locations for bounds calculation
        const validLocations = locations.filter(
          (loc) =>
            typeof loc.x === 'number' &&
            typeof loc.y === 'number' &&
            !isNaN(loc.x) &&
            !isNaN(loc.y)
        );

        if (validLocations.length === 0) {
          console.warn('No valid locations found');
          return;
        }

        // Pre-compute bounds from all valid locations
        const bounds = new mapboxgl.LngLatBounds();
        validLocations.forEach((loc) => {
          const [lng, lat] = xyToLngLat(loc.x, loc.y);
          bounds.extend([lng, lat]);
        });

        // Add more padding to the bounds
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        const lngBuffer = Math.abs(ne.lng - sw.lng) * 0.2; // 20% buffer
        const latBuffer = Math.abs(ne.lat - sw.lat) * 0.2; // 20% buffer
        const expandedBounds = new mapboxgl.LngLatBounds(
          [sw.lng - lngBuffer, sw.lat - latBuffer],
          [ne.lng + lngBuffer, ne.lat + latBuffer]
        );

        // Add every marker
        validLocations.forEach((location) => {
          // Create a DOM element for the marker
          const markerElement = document.createElement('div');
          markerElement.className = 'custom-marker';

          // Add appropriate icon based on location type
          switch (location.iconType) {
            case 'siopao':
              const siopaoVariant = location.siopaoVariant || 1;
              markerElement.innerHTML = `
                <div class="marker-icon siopao-marker">
                  <img src="/siopao-${siopaoVariant}.png" alt="${location.name} Marker" style="width: 36px; height: auto;" />
                </div>
              `;
              break;
            case 'restaurant':
              markerElement.innerHTML = `
                <div class="marker-icon restaurant-marker">
                  <img src="${location.iconUrl || '/siopao-1.png'}" alt="${
                location.name
              } Marker" style="width: 36px; height: auto;" />
                </div>
              `;
              break;
            default:
              if (location.iconUrl) {
                markerElement.innerHTML = `
                  <div class="marker-icon custom-icon-marker">
                    <img src="${location.iconUrl}" alt="${location.name}" style="width: 36px; height: auto; filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4));" />
                  </div>
                `;
              } else {
                markerElement.innerHTML = `
                  <div class="marker-icon default-marker">
                    <img src="/siopao-1.png" alt="${location.name} Marker" style="width: 36px; height: auto;" />
                  </div>
                `;
              }
          }

          // Convert x,y to lng,lat for Mapbox and create marker
          const [lng, lat] = xyToLngLat(location.x, location.y);
          const marker = new mapboxgl.Marker(markerElement)
            .setLngLat([lng, lat])
            .addTo(map);

          console.log(`Added marker for ${location.name} at ${lng},${lat}`);

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

          // Store reference for cleanup
          markersRef.current.push(marker);
        });

        // Ensure the map fits all markers with padding
        console.log(
          'Fitting to bounds with',
          validLocations.length,
          'locations'
        );
        try {
          map.fitBounds(expandedBounds, {
            padding: 100,
            maxZoom: defaultZoom < 3 ? defaultZoom : 3, // Limit zoom to ensure wider view
          });
        } catch (e) {
          console.error('Error fitting to bounds:', e);
        }
      };

      // Add CSS for markers
      const style = document.createElement('style');
      style.textContent = `
        .custom-marker {
          cursor: pointer;
          transition: transform 0.2s ease;
          width: 40px;
          height: 40px;
        }
        .custom-marker:hover {
          transform: scale(1.2);
        }
        .marker-icon {
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .siopao-marker {
          transform: translateY(-50%);
        }
      `;
      document.head.appendChild(style);

      // Add controls
      map.addControl(new mapboxgl.AttributionControl(), 'bottom-left');
      map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

      // Save reference to map
      mapInstanceRef.current = map;
      mapInitializedRef.current = true;

      // Wait for map to load before adding markers and custom map
      map.on('load', () => {
        // Set background color
        map.addLayer({
          id: 'background-layer',
          type: 'background',
          paint: {
            'background-color': '#3b3b3f',
          },
        });

        if (useCustomMap && mapImageUrl) {
          // Generate a unique source ID
          const customMapSourceId = 'custom-map-' + Date.now();
          customMapRef.current = customMapSourceId;

          // Convert bounds for custom map
          const swCoord = xyToLngLat(mapBounds[0][1], mapBounds[0][0]);
          const neCoord = xyToLngLat(mapBounds[1][1], mapBounds[1][0]);

          // Load custom map image
          const mapImage = new Image();
          mapImage.onload = () => {
            try {
              // Add image, source and layer
              map.addImage('custom-map-image', mapImage);
              map.addSource(customMapSourceId, {
                type: 'image',
                url: mapImageUrl,
                coordinates: [
                  [swCoord[0], neCoord[1]], // Top left
                  [neCoord[0], neCoord[1]], // Top right
                  [neCoord[0], swCoord[1]], // Bottom right
                  [swCoord[0], swCoord[1]], // Bottom left
                ],
              });
              map.addLayer({
                id: 'custom-map-layer',
                type: 'raster',
                source: customMapSourceId,
                paint: {
                  'raster-opacity': 1,
                },
              });

              // Add markers after map is loaded
              addMarkers();
            } catch (error) {
              console.error('Error setting up custom map:', error);
              addMarkers(); // Still try to add markers
            }
          };

          mapImage.onerror = () => {
            console.error('Failed to load map image');
            addMarkers(); // Still try to add markers
          };

          mapImage.src = mapImageUrl;
        } else {
          // Just add markers if not using custom map
          addMarkers();
        }
      });

      // Clean up when map is removed
      map.on('remove', () => {
        style.remove();
      });
    };

    // Initialize map
    initializeMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        mapInitializedRef.current = false;
      }
    };
  }, [
    mounted,
    mapboxToken,
    mapImageUrl,
    mapStyle,
    useCustomMap,
    defaultZoom,
    locationsSnapshot, // Use snapshot to trigger rerenders when locations change
  ]);

  return (
    <div
      ref={mapContainerRef}
      className="map-container w-full h-full"
      style={{ backgroundColor: '#3b3b3f' }}
    ></div>
  );
};

export default FoodMapRenderer;
