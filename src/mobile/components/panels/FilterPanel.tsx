"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dish } from '@/types/types';
import CloseButton from "@/components/buttons/CloseButton";
import { Search } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
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
    <>
      {/* Blurred background */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Filter Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-5/6 md:w-1/3 bg-white shadow-lg z-50 transform transition-transform duration-300
        ${isVisible ? "translate-x-0" : "-translate-x-full"} flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Image src="/filter-icon.png" alt="Filter" width={20} height={20} />
            Filter Dishes
          </div>
          <CloseButton onClick={onClose} />
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none bg-gray-200"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size="21" />
            </div>
          </div>
        </div>

        {/* Dish Grid */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {filteredDishes.map((dish) => {
              const isSelected = selectedDishes.includes(dish.name);
              return (
                <div
                  key={dish.name}
                  className={`relative border rounded-md overflow-hidden cursor-pointer
                    ${isSelected ? "border-yellow-400" : "border-gray-200"}`}
                  onClick={() => handleToggleDishSelection(dish.name)}
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
                  {isSelected && (
                    <div className="absolute inset-0 bg-yellow-300 opacity-10" />
                  )}
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
            className="w-full bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-300 transition-colors"
            onClick={applyFilters}
          >
            Add to Filter ({selectedDishes.length})
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
