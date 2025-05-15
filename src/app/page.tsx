'use client';

import { useEffect, useState, Suspense } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import MapLayout from '@/components/MapLayout';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative max-h-screen bg-white">
      {/* Suspense allows useSearchParams in MapLayout */}
      <Suspense fallback={<div />}>
        <div className={isLoading ? 'invisible h-0 overflow-hidden' : ''}>
          <MapLayout />
        </div>
      </Suspense>

      {isLoading && (
        <div className="absolute inset-0 z-50">
          <LoadingScreen />
        </div>
      )}
    </main>
  );
}
