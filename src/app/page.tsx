'use client';

import { Suspense, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import DelayedComponent, { resetCache } from '@/components/map/delayed-component';
import MapLayout from "@/components/MapLayout";

export default function Home() {
  // Reset the cache when the component mounts
  useEffect(() => {
    resetCache();
  }, []);

  return (
    <main className="max-h-screen bg-white">
      <Suspense fallback={<LoadingScreen />}>
        <DelayedComponent delayTime={3500}>
          {/* Main content will appear after loading */}
            <MapLayout />
        </DelayedComponent>
      </Suspense>
    </main>
  );
}
