'use client';

import React, { useState, useEffect } from 'react';
import { Location } from '@/lib/locationData';
import { ilonggoDishes } from '@/lib/dishData';

interface FilterDishesViewProps {
  activeFilters: string[];
  onFilterChange?: (filters: string[]) => void;
  locationsMap: {
    [key: string]: Location[]; // key is dish name, value is array of locations
  };
  onClose?: () => void; // Optional callback to close the filter view
}

const FilterDishesView: React.FC<FilterDishesViewProps> = ({
  activeFilters = [],
  onFilterChange,
  locationsMap,
  onClose,
}) => {
  // Initialize selectedDishes with activeFilters from props
  const [selectedDishes, setSelectedDishes] = useState<string[]>(activeFilters);
  const [searchTerm, setSearchTerm] = useState('');

  // Update selectedDishes when activeFilters prop changes
  useEffect(() => {
    setSelectedDishes(activeFilters);
  }, [activeFilters]);

  // Filter dishes based on search term
  const filteredDishes = ilonggoDishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle dish selection
  const toggleDishSelection = (dishName: string) => {
    setSelectedDishes((prev) => {
      if (prev.includes(dishName)) {
        return prev.filter((name) => name !== dishName);
      } else {
        return [...prev, dishName];
      }
    });
  };

  // Apply filters when "Add to Filter" button is clicked
  const applyFilters = () => {
    if (typeof onFilterChange === 'function') {
      onFilterChange(selectedDishes);
    }

    // If an onClose function was provided, call it to close the filter view
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  // Close the filter panel without applying changes
  const closePanel = () => {
    // Reset selections to match the current active filters
    setSelectedDishes(activeFilters);

    // If an onClose function was provided, call it to close the filter view
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto z-40">
      <div className="relative w-full bg-white shadow-md">
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="font-medium text-lg">Filter Dishes</span>
          </div>
          <button
            onClick={closePanel}
            className="ml-auto p-1 text-gray-500 hover:text-gray-700 rounded-full"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="relative p-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search Dishes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredDishes.map((dish) => {
          const isSelected = selectedDishes.includes(dish.name);
          const locationCount = locationsMap[dish.name]?.length || 0;
          return (
            <div
              key={dish.name}
              className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
              onClick={() => toggleDishSelection(dish.name)}
            >
              <div className="relative">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-36 object-cover"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-lg">{dish.name}</h3>
                <p className="text-sm text-gray-500">
                  {locationCount}{' '}
                  {locationCount === 1 ? 'Location' : 'Locations'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={applyFilters}
          className="w-full py-3 bg-yellow-400 text-gray-800 font-medium rounded-lg shadow-sm hover:bg-yellow-500 transition-colors"
        >
          Add to Filter ({selectedDishes.length})
        </button>
      </div>
    </div>
  );
};

export default FilterDishesView;
