'use client';

import React, { memo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Function to preload an image
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => {
      console.error(`Failed to preload image: ${src}`);
      // Resolve anyway to not block the UI
      resolve();
    };
    img.src = src;
  });
};

// Client Component wrapper for map
export const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  // Preload map and marker images
  useEffect(() => {
    const preloadMapImages = async () => {
      try {
        // Wait for all images to load
        await Promise.all([
          preloadImage('/Map.png'),
          preloadImage('/siopao-1.png'),
          preloadImage('/siopao-2.png'),
          preloadImage('/siopao-3.png'),
        ]);
        console.log('Map images preloaded successfully');
      } catch (err) {
        console.error('Error preloading map images:', err);
      } finally {
        setImagesPreloaded(true);
      }
    };

    preloadMapImages();
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || !imagesPreloaded) {
    return (
      <div
        className="h-full w-full flex items-center justify-center"
        style={{ backgroundColor: '#3b3b3f' }}
      >
        <p className="text-white">Loading map...</p>
      </div>
    );
  }

  return <>{children}</>;
};

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

// Create a memoized version of the component to prevent unnecessary re-renders
export const MapComponent = memo(
  DynamicMapComponent,
  (prevProps, nextProps) => {
    // Simple comparison that just checks for equality in the mapImageUrl and defaultZoom
    // All other logic is handled internally by FixedMapComponent
    return (
      prevProps.mapImageUrl === nextProps.mapImageUrl &&
      prevProps.defaultZoom === nextProps.defaultZoom &&
      prevProps.useCustomMap === nextProps.useCustomMap
    );
  }
);

// Empty state component to show when no dishes are selected
export const EmptyState = () => (
  <div
    className="h-full w-full flex flex-col items-center justify-center"
    style={{ backgroundColor: '#3b3b3f' }}
  >
    <svg
      className="w-16 h-16 text-gray-400 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
    <h3 className="text-xl font-medium text-white mb-2">No dishes selected</h3>
    <p className="text-gray-300 text-center max-w-xs">
      Please select at least one dish from the filter above to view locations on
      the map.
    </p>
  </div>
);
