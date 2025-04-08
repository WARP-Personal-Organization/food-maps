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
      {/* Header Section */}
      <div className="relative w-full bg-white shadow-md">
        <div className="flex items-center p-4 border-b border-gray-200">
          {/* Filter Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-2 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
            />
          </svg>
          {/* Title - Revert back to text-xl */}
          <span className="font-semibold text-xl">Filter Dishes</span>
          {/* Close Button */}
          <button
            onClick={closePanel}
            className="ml-auto w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
            aria-label="Close"
          >
            {/* X Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {/* Search Bar Section */}
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
              className="block w-full pl-10 pr-3 py-2 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Grid for Dishes - Adjust gap based on original image */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-4">
        {filteredDishes.map((dish) => {
          const isSelected = selectedDishes.includes(dish.name);
          const locationCount = locationsMap[dish.name]?.length || 0;
          return (
            <div
              key={dish.name}
              // Revert selected bg, keep border, remove default shadow
              className={`rounded-lg overflow-hidden cursor-pointer ${
                isSelected
                  ? 'border-2 border-yellow-400 bg-yellow-50'
                  : 'bg-gray-50'
              }`}
              onClick={() => toggleDishSelection(dish.name)}
            >
              <div className="relative">
                <img
                  src={dish.image}
                  alt={dish.name}
                  // Adjust image height based on original image
                  className="w-full h-32 object-cover"
                />
                {isSelected && (
                  // Checkmark indicator styling - Revert size
                  <div
                    className="absolute top-0 right-0 bg-yellow-400 w-6 h-6 flex items-center justify-center"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                  >
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
              {/* Revert padding inside card */}
              <div className="p-3">
                {/* Revert dish name text style */}
                <h3 className="font-semibold text-base">{dish.name}</h3>
                {/* Show location count on all screens */}
                <p className="text-xs text-gray-500">
                  {locationCount}{' '}
                  {locationCount === 1 ? 'Location' : 'Locations'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Button Section - Revert to original style */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={applyFilters}
          // Revert button styles to match original image (no icon, adjusted padding/text color)
          className="w-full py-3 bg-yellow-400 text-gray-800 font-semibold rounded-lg shadow-sm hover:bg-yellow-500 transition-colors"
        >
          {/* Text only */}
          Add to Filter ({selectedDishes.length})
        </button>
      </div>
    </div>
  );
};

export default FilterDishesView;
