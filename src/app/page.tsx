"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import MapLayout from "@/components/MapLayout";
import { AnimatePresence } from "framer-motion";

// Preload map images during loading screen
const preloadMapAssets = async () => {
  const imageUrls = [
    "/images/map/Map.png",
    // Location markers
    "/images/location-markers/siopao-1.png",
    "/images/location-markers/siopao-2.png",
    "/images/location-markers/siopao-3.png",
    "/images/location-markers/batchoy-marker-1.png",
    "/images/location-markers/batchoy-marker-2.png",
    "/images/location-markers/kbl-marker-1.png",
    // Foodprint markers
    "/images/foodprint-markers/batchoy-foodprint-marker.png",
    "/images/foodprint-markers/cansi-foodprint-marker.png",
    "/images/foodprint-markers/inasal-foodprint-marker.png",
    "/images/foodprint-markers/kbl-foodprint-marker.png",
    "/images/foodprint-markers/pancit-molo-foodprint-marker.png",
    "/images/foodprint-markers/seafood-foodprint-marker.png",
    "/images/foodprint-markers/siopao-foodprint-marker.png",
    // Pin marker icons
    "/images/pin-marker-icons/batchoy.webp",
    "/images/pin-marker-icons/cansi.webp",
    "/images/pin-marker-icons/inasal.webp",
    "/images/pin-marker-icons/kbl.webp",
    "/images/pin-marker-icons/pancit-molo.webp",
    "/images/pin-marker-icons/seafood.webp",
    "/images/pin-marker-icons/siopao.webp",
    // General icons
    "/images/foodprint-markers/general-icon.png",
    "/images/filter-icon.png",
  ];

  const preloadPromises = imageUrls.map((url) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`Failed to preload: ${url}`);
        resolve();
      };
      img.src = url;
    });
  });

  try {
    await Promise.all(preloadPromises);
    console.log("All map assets preloaded successfully");
  } catch (error) {
    console.error("Error preloading map assets:", error);
  }
};

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [assetsPreloaded, setAssetsPreloaded] = useState<boolean>(false);
  const startTimeRef = useRef<number>(Date.now());
  const minLoadingTime = 1600; // 3.5 seconds minimum

  useEffect(() => {
    // Start preloading assets immediately
    preloadMapAssets().then(() => {
      setAssetsPreloaded(true);
    });

    // Function to check if we can finish loading
    const checkLoadingComplete = () => {
      const elapsedTime = Date.now() - startTimeRef.current;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      if (assetsPreloaded && remainingTime <= 0) {
        setIsLoading(false);
      } else if (assetsPreloaded && remainingTime > 0) {
        // Assets are ready but we need to wait for minimum time
        setTimeout(() => setIsLoading(false), remainingTime);
      }
    };

    // Check every 100ms if we can finish loading
    const checkInterval = setInterval(checkLoadingComplete, 100);

    return () => {
      clearInterval(checkInterval);
    };
  }, [assetsPreloaded]);

  return (
    <main className="relative max-h-screen bg-white">
      <Suspense fallback={<div />}>
        <div
          className={`h-full w-full transition-opacity duration-500 ${
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
