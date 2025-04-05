'use client';

import React, { useState } from 'react';
import FoodMapLayout from '@/components/layout/FoodMapLayout';
import { ilonggoDishes } from '@/lib/dishData';
import { dishLocations } from '@/lib/locationData';
import DishFilter from '@/components/food-map/DishFilter';

export default function FoodMapPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Filter dishes based on active filters
  const filteredDishes =
    activeFilters.length === 0
      ? ilonggoDishes
      : ilonggoDishes.filter((dish) => activeFilters.includes(dish.name));

  // Filter locations based on active filters
  const filteredLocations =
    activeFilters.length === 0
      ? dishLocations
      : Object.fromEntries(
          Object.entries(dishLocations).filter(([dishName]) =>
            activeFilters.includes(dishName)
          )
        );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* We'll pass the filter UI to FoodMapLayout instead of positioning it here */}
      <FoodMapLayout
        dishes={filteredDishes}
        locationsMap={filteredLocations}
        filterUI={
          <DishFilter
            dishes={ilonggoDishes}
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
          />
        }
      />
    </div>
  );
}
