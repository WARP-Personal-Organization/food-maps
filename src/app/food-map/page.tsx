"use client";

import { Suspense } from "react";
import MapLayout from "@/components/MapLayout";

// Main page component with Suspense boundary
export default function FoodMapPage() {
  return (
    <Suspense>
      <MapLayout />
    </Suspense>
  );
}
