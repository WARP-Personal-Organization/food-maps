'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Client Component wrapper for map
export const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <p>Loading map...</p>
      </div>
    );
  }

  return <>{children}</>;
};

// Dynamically import the Map component to avoid SSR issues with Mapbox
export const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <p>Loading map...</p>
    </div>
  ),
});

// Empty state component to show when no dishes are selected
export const EmptyState = () => (
  <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100">
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
    <h3 className="text-xl font-medium text-gray-1000 mb-2">
      No dishes selected
    </h3>
    <p className="text-gray-500 text-center max-w-xs">
      Please select at least one dish from the filter above to view locations on
      the map.
    </p>
  </div>
);
