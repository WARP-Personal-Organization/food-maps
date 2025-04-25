'use client';

import React, { useState, useEffect } from 'react';
import { Location } from '@/lib/locationData';
import { ilonggoDishes } from '@/lib/dishData';
import Image from 'next/image';

interface FilterDishesViewProps {
  activeFilters: string[];
  onFilterChange?: (filters: string[]) => void;
  locationsMap: {
    [key: string]: Location[]; // key is dish name, value is array of locations
  };
  onClose?: () => void; // Optional callback to close the filter view
  isMobile?: boolean; // New prop to determine if it's mobile view
}

const FilterDishesView: React.FC<FilterDishesViewProps> = ({
  activeFilters = [],
  onFilterChange,
  locationsMap,
  onClose,
  isMobile = false, // Default to desktop view
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
    console.log('Close panel function triggered');
    // Reset selections to match the current active filters
    setSelectedDishes(activeFilters);

    // If an onClose function was provided, call it to close the filter view
    if (typeof onClose === 'function') {
      console.log('Calling onClose function');
      onClose();
    }
  };

  // Helper function to render a dish card
  const renderDishCard = (name: string, image: string) => {
    const isSelected = selectedDishes.includes(name);
    const locationCount = locationsMap[name]?.length || 5;

    return (
      <div
        className={`rounded-lg overflow-hidden cursor-pointer ${
          isSelected ? 'ring-2 ring-yellow-400' : ''
        }`}
        onClick={() => toggleDishSelection(name)}
      >
        <div className="relative">
          <img src={image} alt={name} className="w-full h-32 object-cover" />
          {isSelected && (
            <div className="absolute top-1 right-1 z-10">
              <div className="bg-yellow-400 w-7 h-7 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-black"
                >
                  <path
                    d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className="p-2 bg-gray-50 min-h-[60px] flex flex-col justify-between">
          <h3 className="font-medium text-sm line-clamp-2">{name}</h3>
          <p className="text-xs text-gray-500 mt-1 whitespace-nowrap overflow-visible">
            {locationCount} {locationCount === 1 ? 'Location' : 'Locations'}
          </p>
        </div>
      </div>
    );
  };

  // Render for mobile view
  if (isMobile) {
    // Handle direct close button click with stopPropagation
    const handleCloseButtonClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent event bubbling
      console.log('Mobile close button clicked');

      // Reset selections to match the current active filters
      setSelectedDishes(activeFilters);

      // Call onClose directly to ensure it's invoked
      if (typeof onClose === 'function') {
        console.log('Directly calling onClose function from close button');
        onClose();
      }
    };

    // Handle overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
      // Only close if clicking directly on the overlay, not its children
      if (e.target === e.currentTarget) {
        console.log('Overlay clicked');

        // Reset selections to match the current active filters
        setSelectedDishes(activeFilters);

        // Call onClose directly
        if (typeof onClose === 'function') {
          console.log('Directly calling onClose function from overlay');
          onClose();
        }
      }
    };

    return (
      <div className="fixed inset-0 flex z-40">
        {/* Blurred background overlay (for mobile) */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={handleOverlayClick}
        ></div>

        {/* Main panel - 80% width on mobile */}
        <div
          className="relative w-[80%] h-full flex flex-col bg-white overflow-hidden z-40"
          onClick={(e) => e.stopPropagation()} // Prevent clicks from reaching the overlay
        >
          {/* Header Section */}
          <div className="relative w-full bg-white">
            <div className="flex items-center p-4">
              <span className="font-medium text-2xl flex items-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2"
                >
                  <path
                    d="M3 4H21V6H3V4ZM9 11H21V13H9V11ZM3 18H21V20H3V18Z"
                    fill="currentColor"
                  />
                </svg>
                Filter Dishes
              </span>
              {/* Close Button */}
              <button
                onClick={handleCloseButtonClick}
                className="ml-auto w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md"
                aria-label="Close"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            {/* Search Bar Section */}
            <div className="px-4 py-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-400"
                  >
                    <path
                      d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search Dishes"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-1 focus:border-gray-300 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Dishes Grid */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 grid grid-cols-2 gap-4 auto-rows-min">
            {renderDishCard('Siopao', '/images/filter-dish/siopao.png')}
            {renderDishCard(
              'La Paz Batchoy',
              '/images/filter-dish/batchoy.webp'
            )}
            {renderDishCard('Cansi', '/images/filter-dish/cansi.jpg')}
            {renderDishCard('Inasal', '/images/filter-dish/inasal.jpg')}
            {renderDishCard('KBL', '/images/filter-dish/kbl.jpg')}
            {renderDishCard(
              'Pancit Molo',
              '/images/filter-dish/pancit_molo.jpg'
            )}

            {/* Display the rest of the dishes dynamically if not hardcoded above */}
            {filteredDishes
              .filter(
                (dish) =>
                  ![
                    'Siopao',
                    'La Paz Batchoy',
                    'Cansi',
                    'Inasal',
                    'KBL',
                    'Pancit Molo',
                  ].includes(dish.name)
              )
              .map((dish) => renderDishCard(dish.name, dish.image))}
          </div>

          {/* Footer Button */}
          <div className="p-4 mt-auto border-t border-gray-200 bg-white">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                console.log('Mobile Add to Filter button clicked');
                applyFilters();
              }}
              className="w-full py-3 bg-yellow-400 text-center font-medium text-gray-900 rounded-md cursor-pointer"
            >
              Add to Filter ({selectedDishes.length})
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render for desktop view (original layout)
  return (
    <div className="h-full w-full flex flex-col bg-white overflow-hidden z-40 max-w-[540px] mx-auto sm:max-w-none">
      {/* Header Section */}
      <div className="relative w-full bg-white">
        <div className="flex items-center p-8">
          <span className="font-bold text-xl lg:text-2xl flex items-center">
          <Image src="/filter-icon.png" alt="Filter" width={24} height={24} className='mr-2'/>
            Filter Dishes
          </span>
          {/* Close Button */}
          <button
            onClick={closePanel}
            className="ml-auto w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center bg-gray-100 rounded-md"
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {/* Search Bar Section */}
        <div className="px-3 lg:px-4 py-2 lg:py-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400"
              >
                <path
                  d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search Dishes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-1 focus:border-gray-300 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="flex-1 overflow-y-auto px-3 lg:px-4 pb-3 lg:pb-4 grid grid-cols-2 gap-3 lg:gap-4 auto-rows-min">
        {renderDishCard('Siopao', '/images/filter-dish/siopao.png')}
        {renderDishCard('La Paz Batchoy', '/images/filter-dish/batchoy.webp')}
        {renderDishCard('Cansi', '/images/filter-dish/cansi.jpg')}
        {renderDishCard('Inasal', '/images/filter-dish/inasal.jpg')}
        {renderDishCard('KBL', '/images/filter-dish/kbl.jpg')}
        {renderDishCard('Pancit Molo', '/images/filter-dish/pancit_molo.jpg')}

        {/* Display the rest of the dishes dynamically if not hardcoded above */}
        {filteredDishes
          .filter(
            (dish) =>
              ![
                'Siopao',
                'La Paz Batchoy',
                'Cansi',
                'Inasal',
                'KBL',
                'Pancit Molo',
              ].includes(dish.name)
          )
          .map((dish) => renderDishCard(dish.name, dish.image))}
      </div>

      {/* Footer Button */}
      <div className="p-3 lg:p-4 mt-auto border-t border-gray-200 bg-white">
        <button
          onClick={applyFilters}
          className="w-full py-2.5 lg:py-3 bg-yellow-400 text-center font-medium text-gray-900 rounded-md cursor-pointer"
        >
          Add to Filter ({selectedDishes.length})
        </button>
      </div>
    </div>
  );
};

export default FilterDishesView;
