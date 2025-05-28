'use client';

import { useEffect, useState, Suspense } from 'react';
import LoadingScreen from '@/components/LoadingScreen'; // Ensure this path is correct
import MapLayout from '@/components/MapLayout'; // Ensure this path is correct
import { AnimatePresence } from 'framer-motion';

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true); // Explicitly type useState

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
        {/* You might want to consider what happens if MapLayout itself causes issues if it's rendered invisibly. */}
        {/* If MapLayout relies on being visible for certain operations (e.g., map initialization), */}
        {/* consider only rendering it AFTER isLoading is false. */}
        {/* For now, keeping your original logic for visibility. */}
        <div className={isLoading ? 'invisible h-0 overflow-hidden' : ''}>
          <MapLayout />
        </div>
      </Suspense>

      <AnimatePresence>
        {isLoading && (
          <div className="absolute inset-0 z-50">
            <LoadingScreen />
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}