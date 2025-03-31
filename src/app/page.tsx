'use client';

import { Suspense, useEffect } from 'react';
import LoadingScreen from '@/components/loading-screen';
import DelayedComponent, { resetCache } from '@/components/delayed-component';
import HomePage from '@/components/Homepage';

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
          <div className="">
            <HomePage/>
          </div>
        </DelayedComponent>
      </Suspense>
    </main>
  );
}
