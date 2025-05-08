'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dish } from '@/types/types';
import CloseButton from '@/components/buttons/CloseButton';

interface FilterPanelProps {
  dishData: Dish[];
  initialSelectedDishes: string[];
  isVisible: boolean;
  onClose: () => void;
  onFilterApply: (filters: string[]) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  dishData,
  isVisible,
  initialSelectedDishes,
  onClose,
  onFilterApply,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);

  useEffect(() => {
    if (isVisible) {
      setSelectedDishes(initialSelectedDishes);
    }
  }, [isVisible, initialSelectedDishes]);

  const handleToggleDishSelection = (dish: string) => {
    setSelectedDishes((prev) =>
      prev.includes(dish)
        ? prev.filter((item) => item !== dish)
        : [...prev, dish]
    );
  };

  const applyFilters = () => {
    onFilterApply(selectedDishes);
    onClose();
  };

  const filteredDishes = dishData.filter((dish) =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`fixed top-0 left-0 w-[300px] min-w-[300px] md:w-[320px] lg:w-[350px] xl:w-[400px] h-screen max-h-screen bg-white shadow-lg z-50 transform transition-transform duration-300 flex flex-col
        ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Header - fixed height */}
      <div className="flex items-center justify-between p-4 border-b shrink-0">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Image src="/filter-icon.png" alt="Filter" width={20} height={20} />
          Filter Dishes
        </div>
        <CloseButton onClick={onClose} />
      </div>

      {/* Search - fixed height */}
      <div className="p-4 shrink-0">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none"
            placeholder="Search dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search dishes"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Dish List - flexible height */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-4 grid grid-cols-2 gap-3 pb-4">
          {filteredDishes.map((dish) => {
            const isSelected = selectedDishes.includes(dish.name);
            return (
              <div
                key={dish.name}
                className={`relative border rounded-md overflow-hidden cursor-pointer ${
                  isSelected ? 'border-yellow-400' : 'border-gray-200'
                }`}
                onClick={() => handleToggleDishSelection(dish.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleToggleDishSelection(dish.name);
                    e.preventDefault();
                  }
                }}
                tabIndex={0}
                role="checkbox"
                aria-checked={isSelected}
                aria-label={`${dish.name}, ${dish.locations.length} Locations`}
              >
                <div className="relative w-full h-24">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-md"
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-yellow-400 text-black px-1 text-sm">
                      ✓
                    </div>
                  )}
                </div>
                <div className="p-2 text-sm bg-gray-50">
                  <p className="font-semibold line-clamp-1">{dish.name}</p>
                  <p className="text-gray-600 text-xs">
                    {dish.locations.length} Locations
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Button - fixed height */}
      <div className="p-4 border-t mt-auto shrink-0">
        <button
          className="w-full bg-yellow-400 text-black font-bold py-2 rounded"
          onClick={applyFilters}
          aria-label={`Add to Filter (${selectedDishes.length} dishes selected)`}
        >
          Add to Filter ({selectedDishes.length})
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
