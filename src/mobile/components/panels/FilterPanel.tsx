"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dish } from '@/types/types';
import CloseButton from "../buttons/CloseButton";

interface FilterPanelProps {
  dishData: Dish[];
  selectedDishes: string[];
  toggleDishSelection: (dish: string) => void;
  isVisible: boolean;
  onClose: () => void;
  onFilterApply: (filters: string[]) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  dishData,
  selectedDishes,
  toggleDishSelection,
  isVisible,
  onClose,
  onFilterApply,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggle = (dish: string) => {
    toggleDishSelection(dish);
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
      className={`fixed top-0 left-0 w-5/6 md:w-1/3 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Image src="/filter-icon.png" alt="Filter" width={20} height={20} />
          Filter Dishes
        </div>
        <CloseButton onClick={onClose} />
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none"
            placeholder="Search dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Dish List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 grid grid-cols-2 gap-3 pb-4">
          {filteredDishes.map((dish) => {
            const isSelected = selectedDishes.includes(dish.name);
            return (
              <div
                key={dish.name}
                className={`relative border rounded-md overflow-hidden cursor-pointer ${
                  isSelected ? "border-yellow-400" : "border-gray-200"
                }`}
                onClick={() => handleToggle(dish.name)}
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

      {/* Footer Button */}
      <div className="p-4 border-t">
        <button
          className="w-full bg-yellow-400 text-black font-bold py-2 rounded"
          onClick={applyFilters}
        >
          Add to Filter ({selectedDishes.length})
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
