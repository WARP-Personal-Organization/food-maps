'use client';

import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  name: string;
  lat: number;
  lng: number;
  description: string;
}

interface MapComponentProps {
  locations: Location[];
}

const MapComponent: React.FC<MapComponentProps> = ({ locations }) => {
  useEffect(() => {
    // Initialize map only on client-side
    if (typeof window !== 'undefined') {
      // Fix Leaflet marker icon issues
      // This is a known issue when using Leaflet with webpack/Next.js
      // The TypeScript types don't include _getIconUrl but it exists at runtime
      const DefaultIcon = L.Icon.Default.prototype as any;
      delete DefaultIcon._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Create map
      const map = L.map('map').setView([10.720321, 122.562019], 15);

      // Add OpenStreetMap tiles
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Add markers for each location
      locations.forEach((location) => {
        const marker = L.marker([location.lat, location.lng]).addTo(map);
        marker.bindPopup(`<b>${location.name}</b><br>${location.description}`);
      });

      // Set bounds to show all markers
      if (locations.length > 1) {
        const bounds = L.latLngBounds(
          locations.map((loc) => [loc.lat, loc.lng])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      // Cleanup function
      return () => {
        map.remove();
      };
    }
  }, [locations]); // Re-run when locations change

  return <div id="map" className="h-full w-full z-0" />;
};

export default MapComponent;
