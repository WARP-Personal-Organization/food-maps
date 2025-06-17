"use client";

import { useEffect, useState, Suspense } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import MapLayout from "@/components/MapLayout";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const loadingScreenTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => {
      clearTimeout(loadingScreenTimer);
    };
  }, []);

  return (
    <main className="relative max-h-screen bg-white">
      <Suspense fallback={<div />}>
        <div
          className={`h-full w-full ${
            !isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
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
