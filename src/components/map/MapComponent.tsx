'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/map.css';
import { FoodPrint, Location } from '@/types/types';

interface MapComponentProps {
  locations: Location[];
  foodPrintMarkers?: FoodPrint[];
  mapImageUrl?: string;
  mapBounds: [[number, number], [number, number]];
  defaultZoom?: number;
  onLocationClick?: (location: Location) => void;
  onFoodPrintClick?: (foodPrint: FoodPrint) => void;
  mapboxToken?: string;
  mapStyle?: string;
  useCustomMap?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({
  locations = [],
  foodPrintMarkers = [],
  mapImageUrl = '/FoodPrints-Map.png',
  mapBounds = [
    [0, 0],
    [1000, 1000],
  ],
  defaultZoom = 12,
  onLocationClick,
  onFoodPrintClick,
  mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    '',
  mapStyle = 'mapbox://styles/mapbox/streets-v12',
  useCustomMap = true,
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
      console.log(
        'Initializing map with',
        locations.length,
        'locations and',
        foodPrintMarkers.length,
        'food prints'
      );

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
        console.log(
          `Adding ${locations.length} locations and ${foodPrintMarkers.length} food prints to map`
        );

        // Clear existing markers
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        // Combine both location and food print data for bounds calculation
        const allPoints = [
          ...locations.filter(
            (loc) =>
              typeof loc.x === 'number' &&
              typeof loc.y === 'number' &&
              !isNaN(loc.x) &&
              !isNaN(loc.y)
          ),
          ...foodPrintMarkers.filter(
            (fp) =>
              typeof fp.x === 'number' &&
              typeof fp.y === 'number' &&
              !isNaN(fp.x) &&
              !isNaN(fp.y)
          ),
        ];

        if (allPoints.length === 0) {
          console.warn('No valid points found');
          return;
        }

        // Pre-compute bounds from all valid points
        const bounds = new mapboxgl.LngLatBounds();
        allPoints.forEach((point) => {
          const [lng, lat] = xyToLngLat(point.x, point.y);
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

        // Add location markers
        locations.forEach((location) => {
          if (
            typeof location.x !== 'number' ||
            typeof location.y !== 'number' ||
            isNaN(location.x) ||
            isNaN(location.y)
          ) {
            return; // Skip invalid locations
          }
          const markerElement = document.createElement('div');
          markerElement.className = 'custom-marker location-marker'; // Class for locations

          // Add appropriate icon based on location type
          switch (location.iconType) {
            case 'siopao':
              // Use siopao variant or default to variant 1
              const siopaoVariant = location.siopaoVariant || 1;
              markerElement.innerHTML = `
                <div class="marker-icon siopao-marker">
                  <img src="/siopao-${siopaoVariant}.png" alt="Siopao Marker" style="width: 36px; height: auto; filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4));" />
                </div>
              `;
              break;
            case 'restaurant':
              markerElement.innerHTML = `
                <div class="marker-icon restaurant-marker">
                  <img src="${location.iconUrl || '/siopao-1.png'}" alt="${
                location.name
              } Marker" style="width: 36px; height: auto; filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4));" />
                </div>
              `;
              break;
            case 'shop':
              markerElement.innerHTML = `
                <div class="marker-icon shop-marker">
                  <img src="${location.iconUrl || '/shop-icon.png'}" alt="${
                location.name
              } Marker" style="width: 36px; height: auto; filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4));" />
                </div>
              `;
              break;
            case 'attraction':
              markerElement.innerHTML = `
                <div class="marker-icon attraction-marker">
                  <img src="${
                    location.iconUrl || '/attraction-icon.png'
                  }" alt="${
                location.name
              } Marker" style="width: 36px; height: auto; filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4));" />
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
                    <img src="/siopao-1.png" alt="${location.name} Marker" style="width: 36px; height: auto; filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4));" />
                  </div>
                `;
              }
          }

          const [lng, lat] = xyToLngLat(location.x, location.y);
          const marker = new mapboxgl.Marker(markerElement)
            .setLngLat([lng, lat])
            .addTo(map);

          marker.getElement().addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent map click event when clicking marker
            if (popupRef.current) {
              popupRef.current.remove();
            }

            // Call the callback without showing popup
            if (onLocationClick) {
              onLocationClick(location);
            }
          });

          markersRef.current.push(marker);
        });

        // Add food print markers
        foodPrintMarkers.forEach((fp) => {
          if (
            typeof fp.x !== 'number' ||
            typeof fp.y !== 'number' ||
            isNaN(fp.x) ||
            isNaN(fp.y)
          ) {
            return; // Skip invalid food prints
          }
          const markerElement = document.createElement('div');
          markerElement.className = 'custom-marker foodprint-marker'; // Class for food prints
          markerElement.innerHTML = `
            <div class="marker-icon foodprint-icon">
              <img src="${fp.iconUrl || '/siopao-foodprint-marker.png'}" alt="${
            fp.name
          }" style="width: 40px; height: auto; filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4));" />
            </div>
          `;

          const [lng, lat] = xyToLngLat(fp.x, fp.y);
          const marker = new mapboxgl.Marker(markerElement)
            .setLngLat([lng, lat])
            .addTo(map);

          // Add popup for food print marker
          marker.getElement().addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent map click event
            if (popupRef.current) {
              popupRef.current.remove();
            }

            // Just call the callback without showing popup
            if (onFoodPrintClick) {
              onFoodPrintClick(fp);
            }
          });

          markersRef.current.push(marker);
        });

        // Ensure the map fits all points with padding
        console.log('Fitting to bounds with', allPoints.length, 'points');
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
        .restaurant-marker {
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
        if (useCustomMap) {
          // Convert bounds for custom map
          const swCoord = xyToLngLat(mapBounds[0][1], mapBounds[0][0]);
          const neCoord = xyToLngLat(mapBounds[1][1], mapBounds[1][0]);

          // Generate unique source ID
          const customMapSourceId = 'custom-map-' + Date.now();
          customMapRef.current = customMapSourceId;

          // Load the FoodPrints-Map.png as the only background
          const mapImage = new Image();
          mapImage.onload = () => {
            try {
              // Add the image as the only background
              map.addImage('custom-map-image', mapImage);
              map.addSource(customMapSourceId, {
                type: 'image',
                url: mapImageUrl, // Using FoodPrints-Map.png
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
                  'raster-opacity': 1, // Full opacity
                },
              });

              // Add markers after map is loaded
              addMarkers();
            } catch (error) {
              console.error('Error setting up map:', error);
              addMarkers(); // Still try to add markers
            }
          };

          mapImage.onerror = () => {
            console.error('Failed to load map image');
            addMarkers(); // Still try to add markers
          };

          // Start loading the image
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
    foodPrintMarkers,
  ]);

  return (
    <div ref={mapContainerRef} className="map-container w-full h-full"></div>
  );
};

export default MapComponent;
