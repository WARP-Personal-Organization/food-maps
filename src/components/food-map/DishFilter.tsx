'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dish } from '@/lib/dishData';

// Define props interface for the DishFilter component
interface DishFilterProps {
  dishes: Dish[];
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

// Filter component with dish category buttons
const DishFilter: React.FC<DishFilterProps> = ({
  dishes,
  activeFilters,
  onFilterChange,
}) => {
  // State for client-side only functionality
  const [mounted, setMounted] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Set mounted state once the component is mounted in the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const removeFilter = (filterName: string) => {
    onFilterChange(activeFilters.filter((name) => name !== filterName));
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // If not mounted yet, render a placeholder with the same structure
  // to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex flex-wrap gap-2 items-start">
        <button className="bg-white rounded-md shadow-md px-3 py-2 text-gray-900 font-medium flex items-center gap-2">
          <div className="w-5 h-5" /> {/* Placeholder for image */}
          <span className="sm:inline hidden">Filter Dishes</span>
        </button>
        <div className="flex flex-wrap gap-2 max-w-[250px] sm:max-w-[500px]">
          {activeFilters.map((filter) => (
            <div
              key={filter}
              className="bg-yellow-300 rounded-full px-4 py-1.5 text-gray-900 font-medium flex items-center gap-2 shadow-sm text-sm"
            >
              <span>{filter}</span>
              <div className="rounded-full w-5 h-5 flex items-center justify-center" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 items-start" ref={filterRef}>
      {/* Filter Dishes Button */}
      <button
        onClick={toggleFilter}
        className="bg-white rounded-md shadow-md px-3 py-2 text-gray-900 font-medium flex items-center gap-2"
      >
        <img src="/filter-icon.png" alt="Filter" className="w-5 h-5" />
        <span className="sm:inline hidden">Filter Dishes</span>
      </button>

      {/* Active Filter Pills - Wrap to next line on mobile */}
      <div className="flex flex-wrap gap-2 max-w-[250px] sm:max-w-[500px]">
        {activeFilters.map((filter) => (
          <div
            key={filter}
            className="bg-yellow-300 rounded-full px-4 py-1.5 text-gray-900 font-medium flex items-center gap-2 shadow-sm text-sm"
          >
            <span>{filter}</span>
            <button
              onClick={() => removeFilter(filter)}
              className="hover:bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Filter Dropdown (appears when filter button is clicked) */}
      {isFilterOpen && (
        <div className="absolute top-12 left-0 z-[1500] bg-white rounded-lg shadow-lg p-3 min-w-[200px] max-h-[60vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            <button
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                activeFilters.length === 0
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => {
                onFilterChange([]);
                setIsFilterOpen(false);
              }}
            >
              All Dishes
            </button>
            {dishes.map((dish) => (
              <button
                key={dish.name}
                className={`px-3 py-2 text-sm rounded-md transition-colors text-left ${
                  activeFilters.includes(dish.name)
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => {
                  // If clicking an already selected filter, just remove it
                  // Otherwise, add it to active filters
                  const newFilters = activeFilters.includes(dish.name)
                    ? activeFilters.filter((name) => name !== dish.name)
                    : [...activeFilters, dish.name];
                  onFilterChange(newFilters);
                  setIsFilterOpen(false);
                }}
              >
                {dish.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DishFilter;
