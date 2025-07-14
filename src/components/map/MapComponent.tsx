"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@/styles/map.css";
import { FoodPrint, Location, District } from "@/types/types";

interface MapComponentProps {
  locations: Location[];
  foodPrintMarkers?: FoodPrint[];
  districts?: District[];
  mapImageUrl?: string;
  mapBounds: [[number, number], [number, number]];
  defaultZoom?: number;
  onLocationClick?: (location: Location) => void;
  onFoodPrintClick?: (foodPrint: FoodPrint) => void;
  mapboxToken?: string;
  mapStyle?: string;
  useCustomMap?: boolean;
  isDesktop?: boolean;
}

const xyToLngLat = (
  x: number,
  y: number,
  mapBounds: [[number, number], [number, number]]
): [number, number] => {
  const minX = mapBounds[0][1];
  const maxX = mapBounds[1][1];
  const minY = mapBounds[0][0];
  const maxY = mapBounds[1][0];

  const normalizedX = (x - minX) / (maxX - minX);
  const normalizedY = (y - minY) / (maxY - minY);

  const lng = -40 + normalizedX * 80;
  const lat = -40 + normalizedY * 80;

  return [lng, lat];
};

const MapComponent: React.FC<MapComponentProps> = ({
  locations = [],
  foodPrintMarkers = [],
  districts = [],
  mapImageUrl = "/images/map/FoodPrints-Map.png",
  mapBounds = [
    [0, 0],
    [1000, 1000],
  ],
  defaultZoom = 12,
  onLocationClick,
  onFoodPrintClick,
  mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    "",
  mapStyle = "mapbox://styles/mapbox/streets-v12",
  useCustomMap = true,
  isDesktop = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mounted, setMounted] = useState(false);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const customMapRef = useRef<string | null>(null);
  const mapInitializedRef = useRef<boolean>(false);
  const customMapSourceId = useMemo(() => `custom-map-${Date.now()}`, []);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  // Set Mapbox access token
  mapboxgl.accessToken = mapboxToken;

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

  // Update marker styles when selection changes
  useEffect(() => {
    if (mapInitializedRef.current) {
      markersRef.current.forEach((marker) => {
        const element = marker.getElement();
        const markerId = element.getAttribute("data-marker-id");
        if (markerId) {
          const imgElement = element.querySelector("img");
          if (imgElement) {
            if (selectedMarkerId === markerId) {
              // Selected marker: larger and normal color
              imgElement.style.filter =
                "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.6))";
              imgElement.style.transform = "scale(1.3)";
              imgElement.style.transition = "all 0.3s ease";
            } else if (selectedMarkerId) {
              // Other markers when one is selected: grey and smaller
              imgElement.style.filter =
                "grayscale(100%) brightness(0.6) drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.3))";
              imgElement.style.transform = "scale(0.8)";
              imgElement.style.transition = "all 0.3s ease";
            } else {
              // No selection: normal state
              imgElement.style.filter =
                "drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4))";
              imgElement.style.transform = "scale(1)";
              imgElement.style.transition = "all 0.3s ease";
            }
          }
        }
      });
    }
  }, [selectedMarkerId]);

  // Main effect to initialize map or update markers
  useEffect(() => {
    // Only run on client side
    if (!mounted || !mapboxToken || !mapContainerRef.current) return;

    const initializeMap = () => {
      console.log(
        "Initializing map with",
        locations.length,
        "locations and",
        foodPrintMarkers.length,
        "food prints"
      );

      // Clean up existing map if it exists
      if (mapInstanceRef.current) {
        console.log("Removing existing map instance");
        mapInstanceRef.current.remove();
      }

      // Create a new map instance
      const map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: useCustomMap ? "mapbox://styles/mapbox/empty-v9" : mapStyle,
        zoom: defaultZoom,
        center: [0, 0],
        attributionControl: false,
        renderWorldCopies: false,
        interactive: true,
        // Completely disable rotation and tilt for stable view
        dragRotate: false,
        pitch: 0,
        bearing: 0,
        // Add bounds to prevent over-scrolling without bouncing
        maxBounds: [
          [-60, -60], // Southwest coordinates - custom map area
          [60, 60], // Northeast coordinates - custom map area
        ],
        // Set zoom limits
        minZoom: 1,
        maxZoom: 15,
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
              typeof loc.x === "number" &&
              typeof loc.y === "number" &&
              !isNaN(loc.x) &&
              !isNaN(loc.y)
          ),
          ...foodPrintMarkers.filter(
            (fp) =>
              typeof fp.x === "number" &&
              typeof fp.y === "number" &&
              !isNaN(fp.x) &&
              !isNaN(fp.y)
          ),
        ];

        if (allPoints.length === 0) {
          console.warn("No valid points found");
          return;
        }

        // Pre-compute bounds from all valid points
        const bounds = new mapboxgl.LngLatBounds();
        allPoints.forEach((point) => {
          const [lng, lat] = xyToLngLat(point.x, point.y, mapBounds);
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
            typeof location.x !== "number" ||
            typeof location.y !== "number" ||
            isNaN(location.x) ||
            isNaN(location.y)
          ) {
            return; // Skip invalid locations
          }
          const markerElement = document.createElement("div");
          markerElement.className = "custom-marker location-marker"; // Class for locations
          markerElement.tabIndex = 0;
          markerElement.setAttribute("role", "button");
          const markerId = `location-${location.name}-${location.x}-${location.y}`;
          markerElement.setAttribute("data-marker-id", markerId);

          if (location.iconUrl) {
            markerElement.innerHTML = `
                  <div class="marker-icon custom-icon-marker">
                    <img src="${location.iconUrl}" alt="${location.name}" style="width: 36px; height: auto; filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4)); transition: all 0.3s ease;" />
                  </div>
                `;
          } else {
            markerElement.innerHTML = `
                  <div class="marker-icon default-marker">
                    <img src="/siopao-1.png" alt="${location.name} Marker" style="width: 36px; height: auto; filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4)); transition: all 0.3s ease;" />
                  </div>
                `;
          }

          const [lng, lat] = xyToLngLat(location.x, location.y, mapBounds);
          const marker = new mapboxgl.Marker(markerElement)
            .setLngLat([lng, lat])
            .addTo(map);

          marker.getElement().addEventListener("click", (e) => {
            e.stopPropagation();
            if (popupRef.current) {
              popupRef.current.remove();
            }

            // Set the selected marker
            setSelectedMarkerId(markerId);

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
            typeof fp.x !== "number" ||
            typeof fp.y !== "number" ||
            isNaN(fp.x) ||
            isNaN(fp.y)
          ) {
            return; // Skip invalid food prints
          }
          const markerElement = document.createElement("div");
          markerElement.className = "custom-marker foodprint-marker"; // Class for food prints
          const markerId = `foodprint-${fp.name}-${fp.x}-${fp.y}`;
          markerElement.setAttribute("data-marker-id", markerId);
          markerElement.innerHTML = `
            <div class="marker-icon foodprint-icon">
              <img src="${fp.iconUrl || "/siopao-foodprint-marker.png"}" alt="${
            fp.name
          }" style="width: 40px; height: auto; filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4)); transition: all 0.3s ease;" />
            </div>
          `;

          const [lng, lat] = xyToLngLat(fp.x, fp.y, mapBounds);
          const marker = new mapboxgl.Marker(markerElement)
            .setLngLat([lng, lat])
            .addTo(map);

          // Add popup for food print marker
          marker.getElement().addEventListener("click", (e) => {
            e.stopPropagation(); //Prevent map click event
            if (popupRef.current) {
              popupRef.current.remove();
            }

            // Set the selected marker
            setSelectedMarkerId(markerId);

            // Just call the callback without showing popup
            if (onFoodPrintClick) {
              onFoodPrintClick(fp);
            }
          });

          markersRef.current.push(marker);
        });

        // Add area label markers
        districts.forEach((district) => {
          if (
            typeof district.x !== "number" ||
            typeof district.y !== "number" ||
            isNaN(district.x) ||
            isNaN(district.y)
          ) {
            return;
          }
          const labelElement = document.createElement("div");
          labelElement.className = "custom-marker area-label-marker";
          // Use clearly smaller text on mobile, larger on desktop
          const fontSizeClass = isDesktop ? "text-3xl" : "text-base";
          labelElement.innerHTML = `
            <span class="text-white font-extrabold ${fontSizeClass} select-none pointer-events-none drop-shadow-lg opacity-80">
              ${district.name}
            </span>
          `;
          const [lng, lat] = xyToLngLat(district.x, district.y, mapBounds);
          const marker = new mapboxgl.Marker({
            element: labelElement,
            anchor: "bottom",
          })
            .setLngLat([lng, lat])
            .addTo(map);
          markersRef.current.push(marker);
        });

        // Ensure the map fits all points with padding
        console.log("Fitting to bounds with", allPoints.length, "points");
        try {
          map.fitBounds(expandedBounds, {
            padding: 100,
            maxZoom: defaultZoom < 3 ? defaultZoom : 3, // Limit zoom to ensure wider view
          });
        } catch (e) {
          console.error("Error fitting to bounds:", e);
        }

        // Prevent zooming beyond limits only
        map.on("zoom", () => {
          const zoom = map.getZoom();
          if (zoom < 1) {
            map.setZoom(1);
          } else if (zoom > 15) {
            map.setZoom(15);
          }
        });

        // Prevent rotation - keep bearing at 0
        map.on("rotate", () => {
          if (map.getBearing() !== 0) {
            map.setBearing(0);
          }
        });

        // Prevent pitch changes - keep pitch at 0
        map.on("pitch", () => {
          if (map.getPitch() !== 0) {
            map.setPitch(0);
          }
        });

        // Update marker styles after adding all markers
        setTimeout(() => {}, 100);
      };

      // Add controls
      if (isDesktop) {
        map.addControl(new mapboxgl.AttributionControl(), "bottom-left");
        map.addControl(
          new mapboxgl.NavigationControl({
            showCompass: true,
            visualizePitch: true,
          }),
          "bottom-right"
        );
      }

      // Save reference to map
      mapInstanceRef.current = map;
      mapInitializedRef.current = true;

      // Wait for map to load before adding markers and custom map
      map.on("load", () => {
        if (useCustomMap) {
          // Convert bounds for custom map
          const swCoord = xyToLngLat(
            mapBounds[0][1],
            mapBounds[0][0],
            mapBounds
          );
          const neCoord = xyToLngLat(
            mapBounds[1][1],
            mapBounds[1][0],
            mapBounds
          );

          // Generate unique source ID

          customMapRef.current = customMapSourceId;

          const mapImage = new Image();
          mapImage.onload = () => {
            try {
              map.addImage("custom-map-image", mapImage);
              map.addSource(customMapSourceId, {
                type: "image",
                url: mapImageUrl,
                coordinates: [
                  [swCoord[0], neCoord[1]],
                  [neCoord[0], neCoord[1]],
                  [neCoord[0], swCoord[1]],
                  [swCoord[0], swCoord[1]],
                ],
              });
              map.addLayer({
                id: "custom-map-layer",
                type: "raster",
                source: customMapSourceId,
                paint: {
                  "raster-opacity": 1,
                },
              });

              // Add markers after map is loaded
              addMarkers();
            } catch (error) {
              console.error("Error setting up map:", error);
              addMarkers(); // Still try to add markers
            }
          };

          mapImage.onerror = () => {
            console.error("Failed to load map image");
            addMarkers(); // Still try to add markers
          };

          // Start loading the image
          mapImage.src = mapImageUrl;
        } else {
          // Just add markers if not using custom map
          addMarkers();
        }
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
    locations,
    foodPrintMarkers,
    isDesktop,
    mapBounds,
    onLocationClick,
    onFoodPrintClick,
    customMapSourceId,
    districts,
  ]);

  // Reset selection when locations or foodprints change
  useEffect(() => {
    setSelectedMarkerId(null);
  }, [locations, foodPrintMarkers]);

  return (
    <div ref={mapContainerRef} className="map-container w-full h-full"></div>
  );
};

export default MapComponent;
