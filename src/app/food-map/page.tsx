'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FoodMapLayout from '@/components/layout/FoodMapLayout';
import { ilonggoDishes } from '@/lib/dishData';
import { dishLocations } from '@/lib/locationData';
import DishFilter from '@/components/food-map/DishFilter';

export default function FoodMapPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isFilterDishesViewOpen, setIsFilterDishesViewOpen] = useState(false);
  const [initialPanelCollapsed, setInitialPanelCollapsed] = useState(false);

  // Initialize client-side state
  useEffect(() => {
    setMounted(true);

    // Get the view parameter from the URL
    const viewParam = searchParams.get('view');
    // If view=map, set the panel to be initially collapsed
    if (viewParam === 'map') {
      setInitialPanelCollapsed(true);
    }

    // Get the dish parameter from the URL
    const dishParam = searchParams.get('dish');
    if (dishParam) {
      // Support multiple dishes separated by commas
      const dishNames = dishParam.split(',');

      // Filter out dishes that don't exist in our data
      const validDishes = dishNames.filter((dishName) =>
        ilonggoDishes.some((dish) => dish.name === dishName)
      );

      if (validDishes.length > 0) {
        setActiveFilters(validDishes);
      }
    }

    // Listen for clearFilters event from FilteredDishPanel
    const handleClearFilters = () => {
      setActiveFilters([]);
      updateUrl([]);
    };

    window.addEventListener('clearFilters', handleClearFilters);

    return () => {
      window.removeEventListener('clearFilters', handleClearFilters);
    };
  }, [searchParams]);

  // Update the URL when filters change
  const updateUrl = (filters: string[]) => {
    // Preserve view parameter if it exists
    const viewParam = searchParams.get('view');
    const viewQueryString = viewParam ? `&view=${viewParam}` : '';

    const newUrl =
      filters.length > 0
        ? `/food-map?dish=${filters
            .map((f) => encodeURIComponent(f))
            .join(',')}${viewQueryString}`
        : viewParam
        ? `/food-map?view=${viewParam}`
        : '/food-map';

    router.push(newUrl, { scroll: false });
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: string[]) => {
    setActiveFilters(newFilters);
    updateUrl(newFilters);
  };

  // Toggle the filter dishes view
  const toggleFilterDishesView = () => {
    console.log(
      'toggleFilterDishesView called, current state:',
      isFilterDishesViewOpen
    );

    // Create a custom event to signal we're changing the filter view
    // without wanting to collapse the panel
    const preventCollapseEvent = new CustomEvent('preventPanelCollapse', {
      bubbles: true,
      detail: { isOpeningFilter: !isFilterDishesViewOpen },
    });
    document.dispatchEvent(preventCollapseEvent);

    // Toggle the filter view state
    setIsFilterDishesViewOpen(!isFilterDishesViewOpen);
    console.log('Filter view state toggled to:', !isFilterDishesViewOpen);
  };

  // Filter dishes based on active filters
  const filteredDishes =
    activeFilters.length === 0
      ? ilonggoDishes
      : ilonggoDishes.filter((dish) => activeFilters.includes(dish.name));

  // If not mounted yet, render a minimal placeholder to avoid hydration mismatch
  if (!mounted) {
    return <div className="flex flex-col h-screen overflow-hidden"></div>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* We'll pass the filter UI to FoodMapLayout instead of positioning it here */}
      <FoodMapLayout
        dishes={filteredDishes}
        locationsMap={dishLocations}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        isFilterDishesViewOpen={isFilterDishesViewOpen}
        toggleFilterDishesView={toggleFilterDishesView}
        initialPanelCollapsed={initialPanelCollapsed}
        filterUI={
          !isFilterDishesViewOpen ? (
            <DishFilter
              dishes={ilonggoDishes}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onFilterButtonClick={toggleFilterDishesView}
            />
          ) : null
        }
      />
    </div>
  );
}
