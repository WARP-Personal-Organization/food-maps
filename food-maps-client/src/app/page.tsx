'use client';

import { Suspense, useEffect } from 'react';
import LoadingScreen from '@/components/loading-screen';
import DelayedComponent, { resetCache } from '@/components/delayed-component';

export default function Home() {
  // Reset the cache when the component mounts
  useEffect(() => {
    resetCache();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={<LoadingScreen />}>
        <DelayedComponent delayTime={3500}>
          {/* Main content will appear after loading */}
          <div className="p-8">
            <h1 className="text-3xl font-bold">Welcome to Food Maps</h1>
            <p className="mt-4 text-lg">Content loaded after delay!</p>
          </div>
        </DelayedComponent>
      </Suspense>
    </main>
  );
}
