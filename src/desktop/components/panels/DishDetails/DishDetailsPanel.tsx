"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, Star, Clock } from "lucide-react";

import { Dish } from "@/types/types";
import { LocationData } from "@/lib/LocationData";
import { denormalizeKey } from "@/lib/utils";
import CloseButton from "@/components/buttons/CloseButton";

import { motion, AnimatePresence } from "framer-motion";

interface DishDetailsPanelProps {
  dishes: Dish[];
  activeFilters?: string[] | null;
  initialIndex?: number;
  isVisible: boolean;
  onClose: () => void;
}

const DishDetailsPanel: React.FC<DishDetailsPanelProps> = ({
  dishes,
  activeFilters = null,
  initialIndex = 0,
  isVisible,
  onClose,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (activeFilters?.length) {
      const index = dishes.findIndex((dish) => dish.name === activeFilters[0]);
      if (index !== -1) setActiveIndex(index);
    }
  }, [activeFilters, dishes]);

  const handlePrevDish = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextDish = () => {
    setActiveIndex((prev) => (prev < dishes.length - 1 ? prev + 1 : prev));
  };

  if (dishes.length === 0) return null;

  const dish = dishes[activeIndex];
  const locations = LocationData[dish.name] || [];
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < dishes.length - 1;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 w-[300px] min-w-[300px] md:w-[320px] lg:w-[350px] xl:w-[400px] h-full bg-white shadow-lg z-10"
        >
          <CloseButton onClick={onClose} className="absolute top-5 right-5 z-40" />

          <div className="relative top-0 left-0 h-full w-full shadow-2xl border-r-4 border-yellow-300 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 lg:p-6 border-b-2 border-yellow-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-yellow-300 rounded-xl shadow-sm">
                  <Star className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h2 className="text-lg lg:text-xl font-black text-gray-900">
                    Dish Details
                  </h2>
                  <p className="text-sm text-gray-600">Discover local flavors</p>
                </div>
              </div>
            </div>

            {/* Image and navigation */}
            <div className="relative w-full h-[25vh]">
              {dish?.image ? (
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={hasPrev ? handlePrevDish : undefined}
                  className={`rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 shadow-lg ${
                    hasPrev
                      ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  aria-label="Previous dish"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={hasNext ? handleNextDish : undefined}
                  className={`rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 shadow-lg ${
                    hasNext
                      ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  aria-label="Next dish"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto bg-gray-50 flex-1 max-h-[calc(100vh-25vh-120px)]">
              <div className="bg-white p-4 lg:p-6 shadow-sm">
                <h1 className="text-2xl lg:text-3xl font-black text-gray-900 mb-2 leading-tight">
                  {denormalizeKey(dish.name)}
                </h1>
                <div className="space-y-3">
                  <p className="text-yellow-600 text-sm lg:text-base font-semibold italic">
                    {dish.tagline}
                  </p>
                  <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                    {dish.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {locations.length} locations
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Open now</span>
                  </div>
                </div>
              </div>

              {/* Locations List */}
              <div className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Available Locations
                  </h3>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {locations.length} found
                  </span>
                </div>

                <div className="space-y-3">
                  {locations.length > 0 ? (
                    locations.map((location, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-yellow-300 transition-all duration-300 hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                              src={
                                location.photos?.[0] ||
                                "/images/placeholder-location.jpg"
                              }
                              alt={location.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
                              {location.name}
                            </h4>
                            <div className="flex items-center gap-1 mb-2">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-600 line-clamp-1">
                                {location.address}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-gray-600">4.5</span>
                              </div>
                              <span className="text-xs text-gray-500">10 min</span>
                            </div>
                          </div>
                          <div className="bg-yellow-100 rounded-full w-6 h-6 flex items-center justify-center">
                            <span className="text-xs font-bold text-yellow-700">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        No locations found
                      </h4>
                      <p className="text-gray-600 text-sm">
                        No locations available for this dish yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="h-6" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DishDetailsPanel;
