'use client';

import { Suspense, useEffect, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import MapLayout from '@/components/MapLayout';
import { resetCache } from '@/components/map/delayed-component';

export default function Home() {
  const [showLoading, setShowLoading] = useState(true);

  // Reset the cache on mount and set loading timeout
  useEffect(() => {
    resetCache();
    const timeout = setTimeout(() => {
      setShowLoading(false);
    }, 3500); // Show loading screen for 3.5 seconds

    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="max-h-screen bg-white">
      {/* Wrap MapLayout in Suspense to handle useSearchParams */}
      <Suspense fallback={<LoadingScreen />}>
        <MapLayout />
      </Suspense>

      {/* Show loading screen on top if still loading */}
      {showLoading && (
        <div className="absolute inset-0 z-50">
          <LoadingScreen />
        </div>
      )}
    </main>
  );
}
