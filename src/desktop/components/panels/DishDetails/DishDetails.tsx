"use client";

import React from "react";

import { ChevronLeft, ChevronRight, MapPin, Star, Clock } from "lucide-react";
import Image from "next/image";

import { LocationData } from "@/lib/LocationData";
import { Dish } from "@/types/types";
import { denormalizeKey } from "@/lib/utils";

interface DishDetailsProps {
  dish: Dish;
  onPrevDish: () => void;
  onNextDish: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const DishDetails: React.FC<DishDetailsProps> = ({
  dish,
  onPrevDish,
  onNextDish,
  hasPrev,
  hasNext,
}) => {
  const locations = LocationData[dish.name] || [];

  const locationCards = locations.map((location) => ({
    name: location.name,
    image: location.photos?.[0] || "/images/placeholder-location.jpg",
    location: location.address || "",
    duration: "10 min",
    rating: 4.5,
    tags: [dish.name],
  }));

  const isVisible = true;

  return (
    <div
      className={`fixed top-0 left-0 h-full w-[300px] min-w-[300px] md:w-[320px] lg:w-[350px] xl:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 border-r-4 border-yellow-300
      ${isVisible ? "translate-x-0" : "-translate-x-full"} flex flex-col`}
    >
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 lg:p-6 border-b-2 border-yellow-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-yellow-300 rounded-xl shadow-sm">
            <Star className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-black text-gray-900">Dish Details</h2>
            <p className="text-sm text-gray-600">Discover local flavors</p>
          </div>
        </div>
        
        {/* Stats indicator */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-yellow-200">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <p className="text-lg font-bold text-gray-900">{locations.length}</p>
              <p className="text-xs text-gray-600">Locations</p>
            </div>
            <div className="w-px h-8 bg-yellow-200"></div>
            <div className="text-center flex-1">
              <p className="text-lg font-bold text-yellow-600">4.5</p>
              <p className="text-xs text-gray-600">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Image Section */}
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
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Navigation buttons on image */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={hasPrev ? onPrevDish : undefined}
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
            onClick={hasNext ? onNextDish : undefined}
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

      {/* Content Section */}
      <div className="flex-grow min-h-0 overflow-y-auto bg-gray-50">
        {/* Title Section */}
        <div className="bg-white p-4 lg:p-6 shadow-sm">
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 mb-2 leading-tight">
            {denormalizeKey(dish.name)}
          </h1>
          
          {/* Enhanced Description */}
          <div className="space-y-3">
            <p className="text-yellow-600 text-sm lg:text-base font-semibold italic">
              {dish.tagline}
            </p>
            <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
              {dish.description}
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">{locations.length} locations</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">Open now</span>
            </div>
          </div>
        </div>

        {/* Locations Section */}
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Available Locations</h3>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
              {locations.length} found
            </span>
          </div>

          {/* Enhanced Locations List */}
          <div className="space-y-3">
            {locationCards.length > 0 ? (
              locationCards.map((location, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-yellow-300 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={location.image}
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
                          {location.location}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{location.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">{location.duration}</span>
                      </div>
                    </div>
                    <div className="bg-yellow-100 rounded-full w-6 h-6 flex items-center justify-center">
                      <span className="text-xs font-bold text-yellow-700">{index + 1}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No locations found</h4>
                <p className="text-gray-600 text-sm">
                  No locations available for this dish yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom padding for scroll */}
        <div className="h-6"></div>
      </div>
    </div>
  );
};

export default DishDetails;