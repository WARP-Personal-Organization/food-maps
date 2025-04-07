'use client';

import React from 'react';
import Image from 'next/image';
import { Dish } from '@/lib/dishData';
import { dishLocations } from '@/lib/locationData';
import LocationCard from './LocationCard';

interface DishDetailsViewProps {
  dish: Dish;
  onPrevDish: () => void;
  onNextDish: () => void;
}

const DishDetailsView: React.FC<DishDetailsViewProps> = ({
  dish,
  onPrevDish,
  onNextDish,
}) => {
  // Get actual locations for this dish from dishLocations
  const locations = dishLocations[dish.name] || [];

  // Convert location data to the format expected by LocationCard
  const locationCards = locations.map((location) => ({
    name: location.name,
    image: location.photos
      ? location.photos[0]
      : '/images/placeholder-location.jpg',
    location: location.address || '',
    duration: '10 min', // This would need to be calculated dynamically in a real app
    rating: 4.5, // This would come from a ratings system in a real app
    tags: [dish.name],
  }));

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* Header with image */}
      <div className="relative h-72 w-full bg-amber-50">
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />

        {/* Left and right navigation arrows */}
        <div className="absolute inset-y-0 left-0 flex items-center">
          <button
            onClick={onPrevDish}
            className="bg-white rounded-full w-8 h-8 flex items-center justify-center ml-2"
            aria-label="Previous dish"
          >
            <div className="text-gray-400">&lt;</div>
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            onClick={onNextDish}
            className="bg-white rounded-full w-8 h-8 flex items-center justify-center mr-2"
            aria-label="Next dish"
          >
            <div className="text-gray-400">&gt;</div>
          </button>
        </div>

        {/* Image indicator dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
            <div
              key={index}
              className={`h-1 w-1 rounded-full ${
                index === 0 ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Dish Information */}
      <div className="px-6 py-6">
        <h1 className="text-4xl font-bold text-gray-900">{dish.name}</h1>
        <p className="text-gray-500 mt-1">{dish.tagline}</p>

        {/* Description */}
        <div className="mt-4">
          <p className="text-gray-700 leading-relaxed">{dish.description}</p>
        </div>

        {/* See Locations Button */}
        <div className="mt-8 border-b border-gray-200 pb-3">
          <div className="text-gray-700 font-medium flex items-center justify-between cursor-pointer">
            <span>See Locations</span>
            <span className="text-gray-400 text-sm">({locations.length})</span>
          </div>
        </div>
      </div>

      {/* Locations List */}
      <div className="flex-grow overflow-auto py-4">
        {locationCards.length > 0 ? (
          locationCards.map((location, index) => (
            <LocationCard
              key={index}
              name={location.name}
              image={location.image}
              location={location.location}
              duration={location.duration}
              rating={location.rating}
              tags={location.tags}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No locations available for this dish
          </div>
        )}
      </div>
    </div>
  );
};

export default DishDetailsView;
