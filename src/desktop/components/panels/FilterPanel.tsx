"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dish } from "@/types/types";
import CloseButton from "@/components/buttons/CloseButton";
import { Search, Filter, X } from "lucide-react";
import { denormalizeKey } from "@/lib/utils";

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
      {/* Enhanced blurred background */}

      {/* Filter Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[400px] bg-white shadow-2xl z-50 transform transition-all duration-500 ease-out border-r-4 border-yellow-300
        ${
          isVisible
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        } flex flex-col`}
      >
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r p-4 sm:p-6 border-b-2 border-yellow-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-yellow-300 rounded-xl shadow-sm">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900">
                  Filter Dishes
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Find your favorites
                </p>
              </div>
            </div>
            <CloseButton
              onClick={onClose}
              className="p-2.5 hover:bg-white/80 rounded-full transition-all duration-300 shadow-sm touch-manipulation"
            />
          </div>

          {/* Stats indicator */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-yellow-200">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  {dishData.length}
                </p>
                <p className="text-xs text-gray-600">Total Dishes</p>
              </div>
              <div className="w-px h-6 sm:h-8 bg-yellow-200"></div>
              <div className="text-center flex-1">
                <p className="text-base sm:text-lg font-bold text-yellow-600">
                  {selectedDishes.length}
                </p>
                <p className="text-xs text-gray-600">Selected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Input */}
        <div className="p-4 sm:p-6 bg-gray-50">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-11 sm:pl-12 pr-11 sm:pr-12 py-3 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-100 bg-white text-gray-900 placeholder-gray-500 transition-all duration-300 shadow-sm text-sm sm:text-base touch-manipulation"
              placeholder="Search delicious dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search dishes"
            />
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-300 touch-manipulation"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Search results count */}
          {searchTerm && (
            <p className="text-xs sm:text-sm text-gray-600 mt-2 ml-1">
              {filteredDishes.length} dish
              {filteredDishes.length !== 1 ? "es" : ""} found
            </p>
          )}
        </div>

        {/* Enhanced Dish Grid */}
        <div className="flex-1 overflow-y-auto bg-gray-50 px-4 sm:px-6 pb-4 sm:pb-6">
          {/* 2 columns for square cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filteredDishes.map((dish) => {
              const isSelected = selectedDishes.includes(dish.name);
              return (
                <div
                  key={dish.name}
                  className={`group relative border-2 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg touch-manipulation ${
                    isSelected
                      ? "border-yellow-400 shadow-lg ring-2 ring-yellow-100"
                      : "border-gray-200 hover:border-yellow-300"
                  }`}
                  onClick={() => handleToggleDishSelection(dish.name)}
                >
                  {/* Square Image Section */}
                  <div className="relative w-full aspect-square">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Gradient overlay for better text contrast */}
                    <div className="absolute inset-0 bg-white-to-t from-black/30 to-transparent" />

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-yellow-400 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-gray-900 rounded-full shadow-lg">
                        <span className="text-xs font-bold">✓</span>
                      </div>
                    )}

                    {/* Location count badge - Yellow circle like in your image */}
                    <div className="absolute bottom-2 left-2 bg-yellow-400 w-8 h-8 flex items-center justify-center rounded-full shadow-lg">
                      <span className="text-sm font-bold text-gray-900">
                        {dish.locations?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Selection overlay */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-yellow-300/15 border-2 border-yellow-400 rounded-2xl pointer-events-none" />
                  )}

                  {/* Compact Info Section */}
                  <div
                    className={`p-2 sm:p-3 transition-all duration-300 ${
                      isSelected
                        ? "bg-yellow-50"
                        : "bg-white group-hover:bg-gray-50"
                    }`}
                  >
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 mb-1 leading-tight">
                      {denormalizeKey(dish.name)}
                    </h3>
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <p className="text-gray-600 text-xs">
                        {dish.locations?.length || 0} Location
                        {(dish.locations?.length || 0) !== 1 ? "s" : ""}
                      </p>
                      {isSelected && (
                        <span className="text-yellow-600 text-xs font-semibold px-1.5 py-0.5 bg-yellow-100 rounded-full">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Empty State */}
          {filteredDishes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                No dishes found
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                Try adjusting your search term or browse all available dishes to
                find what you&apos;re craving.
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-yellow-600 hover:text-yellow-700 font-medium transition-colors duration-300 py-2 px-4 touch-manipulation"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Footer matching your image */}
        <div className="p-4 sm:p-6 border-t-2 border-yellow-200 bg-gradient-to-r safe-area-inset-bottom">
          <button
            className={`w-full font-black py-4 sm:py-4 rounded-xl shadow-lg transition-all duration-300 text-sm sm:text-base touch-manipulation ${
              selectedDishes.length > 0
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            onClick={applyFilters}
            disabled={selectedDishes.length === 0}
          >
            {selectedDishes.length === 0
              ? "Select dishes to filter"
              : `Apply Filter (${selectedDishes.length} selected)`}
          </button>

          {selectedDishes.length > 0 && (
            <button
              onClick={() => setSelectedDishes([])}
              className="w-full mt-3 text-gray-600 hover:text-gray-900 font-semibold py-3 transition-colors duration-300 touch-manipulation"
            >
              Remove All Filters
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
