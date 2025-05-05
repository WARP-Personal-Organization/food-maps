"use client";

import { Suspense } from "react";
import MapLayout from "@/components/food-map/MapContent";

// Main page component with Suspense boundary
export default function FoodMapPage() {
  return (
    <Suspense
      fallback={<div className="flex flex-col h-screen overflow-hidden"></div>}
    >
      <MapLayout />
    </Suspense>
  );
}
