'use client';

import React, { useState, useEffect } from 'react';
import DesktopMapLayout from '@/desktop/DesktopMapLayout';
import MobileMapLayout from '@/mobile/MobileMapLayout';
import { DishData } from '@/lib/DishData';
import { LocationData } from '@/lib/LocationData';
import { FoodPrintData } from '@/lib/FoodPrintData';

function MapLayout() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    const handleClearFilters = () => {
      setActiveFilters([]);
    };

    window.addEventListener('clearFilters', handleClearFilters);
    return () => {
      window.removeEventListener('clearFilters', handleClearFilters);
    };
  }, []);

  const handleFilterChange = (filters: string[] | ((prev: string[]) => string[])) => {
    setActiveFilters((prev) => {
      const newFilters = typeof filters === 'function' ? filters(prev) : filters;
      if (JSON.stringify(prev) !== JSON.stringify(newFilters)) {
        return newFilters;
      }
      return prev;
    });
  };

  return (
    <div className="h-screen w-screen">
      {/* Mobile layout */}
      <MobileMapLayout
        dishData={DishData}
        foodPrintData={FoodPrintData}
        locationsMap={LocationData}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      />

      {/* Desktop layout: visible on screens >= 900px */}
      <div className="hidden min-[900px]:flex overflow-hidden">
        <DesktopMapLayout
          dishData={DishData}
          foodPrintData={FoodPrintData}
          locationsMap={LocationData}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
}

export default MapLayout;
